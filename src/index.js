// @ahzs645/door-sign: UNBC door signs as reusable parts. `DoorSignEditor` and `useDoorSign` are
// the whole editor; every component, hook and core module it is built from is exported too, so
// a host can take a part (the artwork, the preview, the saved-signs browser, the measuring sheets).
// Import './styles.css' (src/styles/door-sign.css) and put the editor inside an element with the
// class "door-sign-app": every rule is scoped to it.

export * from './core.js'
export { DoorSignEditor } from './DoorSignEditor.jsx'
export { useDoorSign } from './useDoorSign.js'

export { SignArtwork, layoutSignArtwork, ARTWORK_FONT } from './sign/SignArtwork.jsx'
export { renderArtworkNode } from './sign/renderArtwork.jsx'
export { NugssLogoMark } from './sign/NugssLogoMark.jsx'

export { SignForm } from './components/SignForm.jsx'
export { CredentialsSection } from './components/CredentialsSection.jsx'
export { SignStyleControls } from './components/SignStyleControls.jsx'
export { SignPreview } from './components/SignPreview.jsx'
export { LivePreview } from './components/LivePreview.jsx'
export { ArchiveNavigator, ArchiveStepper } from './components/ArchiveNavigator.jsx'
export { SavedSignsBrowser } from './components/SavedSignsBrowser.jsx'
export { MeasuringSheetsPage } from './components/MeasuringSheetsPage.jsx'
export { OrganizationSwitcher, OrganizationLogo } from './components/OrganizationSwitcher.jsx'
export { SettingsMenu } from './components/SettingsMenu.jsx'
export { CardHolderSelector } from './components/CardHolderSelector.jsx'
export { DepartmentField } from './components/DepartmentField.jsx'
export { CustomSelect } from './components/CustomSelect.jsx'
export { SegmentedControl } from './components/SegmentedControl.jsx'
export { Switch } from './components/Switch.jsx'
export { HolderMockup } from './components/HolderMockup.jsx'

export { useSignState } from './hooks/useSignState.js'
export { useCardHolders } from './hooks/useCardHolders.js'
export { useSignArchive } from './hooks/useSignArchive.js'
export { usePrintSheet } from './hooks/usePrintSheet.js'
export { useUnits, setUnits } from './hooks/useUnits.js'
export { useMediaQuery } from './hooks/useMediaQuery.js'
