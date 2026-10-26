// The door-sign editor: the sign's details, its appearance and the preview with every export,
// laid out side by side on desktop and as Edit / Preview tabs with a pinned live preview on
// phones. The host owns the sign (useDoorSign) and anything outside the editor: its app bar,
// pages, share links and saved-signs archive data.

import React, { useState } from 'react'
import { SignForm } from './components/SignForm.jsx'
import { SignPreview } from './components/SignPreview.jsx'
import { CredentialsSection } from './components/CredentialsSection.jsx'
import { SignStyleControls } from './components/SignStyleControls.jsx'
import { ArchiveNavigator } from './components/ArchiveNavigator.jsx'
import { LivePreview } from './components/LivePreview.jsx'
import { useMediaQuery } from './hooks/useMediaQuery.js'
import { departmentTypes } from '../vendor/unbc-logo/src/index.js'

const LIVE_PREVIEW_KEY = 'unbc-door-sign:live-preview-hidden'

// Matches the single-column breakpoint in responsive.css.
const COMPACT_QUERY = '(max-width: 959px)'

// Remembered per browser; storage can be unavailable (private mode, blocked site data), in
// which case the live preview simply starts visible.
const readLivePreviewHidden = () => {
  try {
    return window.localStorage.getItem(LIVE_PREVIEW_KEY) === 'true'
  } catch (error) {
    return false
  }
}

const EditIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-4-4L4 16v4z" />
    <path d="m13.5 6.5 4 4" />
  </svg>
)

const PreviewIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 9h18" />
    <path d="M7 13h6M7 16h4" />
  </svg>
)

/**
 * @param {object} props
 * @param {object} props.sign           useDoorSign()'s result.
 * @param {string} [props.as]           The editor's element: 'main' in an app of its own.
 * @param {React.ReactNode} [props.notice]       Shown above the form (UNBCDoor's shared-sign notice).
 * @param {React.ReactNode} [props.shareButton]  Shown with the exports (UNBCDoor's share link).
 * @param {string} [props.browseHref]   The saved-signs page, if the host has one.
 * @param {Function} [props.onBrowse]
 * @param {string} [props.editorHref]
 * @param {string} [props.measuringSheetsHref]   The measuring-sheets page, if the host has one.
 * @param {Function} [props.onOpenMeasuringSheets]
 * @param {object} [props.departments]  The department hierarchy (the UNBC logo kit's by default).
 * @param {boolean} [props.hidden]
 */
export const DoorSignEditor = ({
  sign,
  as: Element = 'main',
  notice = null,
  shareButton = null,
  browseHref,
  onBrowse,
  editorHref,
  measuringSheetsHref,
  onOpenMeasuringSheets,
  departments = departmentTypes,
  hidden = false
}) => {
  const { signData, setSignData, updateSignData, signContent, cardHolders, builtInHolderNames, saveCustomHolder, deleteCustomHolder, archiveState } = sign
  const [activeMobileTab, setActiveMobileTab] = useState('editor')
  const [livePreviewHidden, setLivePreviewHidden] = useState(readLivePreviewHidden)
  const isCompactLayout = useMediaQuery(COMPACT_QUERY)

  const updateLivePreviewHidden = (value) => {
    setLivePreviewHidden(value)
    try {
      window.localStorage.setItem(LIVE_PREVIEW_KEY, String(value))
    } catch (error) {
      // Not remembered this time; the choice still applies for this visit.
    }
  }

  const showMobileTab = (tab) => {
    if (tab === activeMobileTab) return
    setActiveMobileTab(tab)
    window.scrollTo({ top: 0 })
  }

  return (
    <Element
      className={`workspace workspace--${activeMobileTab}`}
      hidden={hidden}
      aria-labelledby="editor-title"
      data-org={signContent.organization}
    >
      <h1 className="visually-hidden" id="editor-title">Door sign editor</h1>

      {/* Phones and tablets: a live copy of the sign stays pinned above the form, so every
          edit is visible without switching to the Preview tab. Desktop shows the full preview
          beside the form instead. */}
      {isCompactLayout && activeMobileTab === 'editor' && (
        livePreviewHidden ? (
          <div className="live-preview-bar">
            <button type="button" className="live-preview-show" onClick={() => updateLivePreviewHidden(false)}>
              Show live preview
            </button>
          </div>
        ) : (
          <LivePreview
            signData={signData}
            cardHolders={cardHolders}
            onOpenPreview={() => showMobileTab('preview')}
            onHide={() => updateLivePreviewHidden(true)}
          />
        )
      )}

      <div id="editor-panel" className="workspace__form" role={isCompactLayout ? 'tabpanel' : undefined} aria-label="Sign details">
        {notice}

        <ArchiveNavigator archiveState={archiveState} browseHref={browseHref} onBrowse={onBrowse} />

        <SignForm signData={signData} onUpdate={updateSignData} departments={departments} />

        <CredentialsSection signData={signData} onUpdate={updateSignData} />

        {/* Appearance sits with the content it restyles; on desktop the preview stays in
            view beside it, and on phones the pinned live preview does the same job. */}
        <SignStyleControls signData={signData} content={signContent} onUpdate={updateSignData} />
      </div>

      <div id="preview-panel" className="workspace__output" role={isCompactLayout ? 'tabpanel' : undefined} aria-label="Preview and export">
        <SignPreview
          signData={signData}
          content={signContent}
          cardHolders={cardHolders}
          builtInHolderNames={builtInHolderNames}
          onSaveCustomHolder={saveCustomHolder}
          onDeleteCustomHolder={deleteCustomHolder}
          onUpdate={updateSignData}
          onReplaceSign={(nextSignData) => {
            // Like a shared sign, a sheet entry isn't one of the open archive's entries.
            archiveState.deselect()
            setSignData(nextSignData)
          }}
          archiveState={archiveState}
          editorHref={editorHref}
          shareButton={shareButton}
          measuringSheetsHref={measuringSheetsHref}
          onOpenMeasuringSheets={onOpenMeasuringSheets}
        />
      </div>

      {/* Thumb-reach switch between editing and the full preview with the export buttons. */}
      {isCompactLayout && (
        <nav className="mobile-dock" aria-label="Editor views">
          <div className="mobile-dock__tabs" role="tablist">
            <button type="button" role="tab" aria-selected={activeMobileTab === 'editor'} aria-controls="editor-panel"
              className={`mobile-dock__tab ${activeMobileTab === 'editor' ? 'active' : ''}`} onClick={() => showMobileTab('editor')}>
              <EditIcon />
              Edit
            </button>
            <button type="button" role="tab" aria-selected={activeMobileTab === 'preview'} aria-controls="preview-panel"
              className={`mobile-dock__tab ${activeMobileTab === 'preview' ? 'active' : ''}`} onClick={() => showMobileTab('preview')}>
              <PreviewIcon />
              Preview &amp; export
            </button>
          </div>
        </nav>
      )}
    </Element>
  )
}
