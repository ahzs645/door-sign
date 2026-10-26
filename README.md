# door-sign

UNBC door signs as reusable parts: the sign artwork, its geometry, the print-ready PDF and PNG
exports, print sheets, card-holder presets (built in and custom), saved-sign archives, measuring
sheets and the editor that puts them together.

Extracted from [UNBCDoor](https://github.com/ahzs645/UNBCDoor), which now consumes it, so the
door-sign generator and any other app (such as [brandkit](https://github.com/ahzs645/brandkit)'s
UNBC Door signs tab) draw and print the same sign from one source. It draws the UNBC logo and
department lines with the [UNBC logo kit](https://github.com/ahzs645/unbc-logo), vendored here as
a submodule.

## Install as a submodule

```bash
git submodule add https://github.com/ahzs645/door-sign.git vendor/door-sign
git submodule update --init --recursive   # the logo kit is a submodule of this one
```

The package is consumed from source; nothing is published to npm. It ships `.jsx` and modern
ESM, so the host's bundler must transpile JSX (any Vite or React setup does). Install its two
runtime dependencies in the host: `jspdf` and `svg2pdf.js`, beside `react` and `react-dom`.

## The editor

```jsx
import { DoorSignEditor, useDoorSign, departmentSelection } from './vendor/door-sign/src/index.js'
import './vendor/door-sign/src/styles/door-sign.css'

// Inside an element with the class "door-sign-app": every style rule is scoped to it.
const Signs = () => {
  const sign = useDoorSign({
    // Optional: the host's own archive of signs, offered in the saved-signs navigator.
    productionArchive,
    // Optional: open on a department chosen elsewhere.
    initialSignData: departmentSelection(departmentTypes, 'School of Engineering')
  })
  return <div className="door-sign-app"><DoorSignEditor sign={sign} as="div" /></div>
}
```

`useDoorSign()` holds the sign, the card holders, the saved-signs archive and the sign's content.
`DoorSignEditor` takes it and lays out the form, the appearance panel and the preview with every
export: side by side on desktop, as Edit / Preview tabs with a pinned live preview on phones.

| Prop | Meaning |
| --- | --- |
| `sign` | `useDoorSign()`'s result. |
| `as` | The editor's element. `'main'` (default) in an app of its own, `'div'` inside another app. |
| `notice` | Shown above the form (UNBCDoor's shared-sign notice). |
| `shareButton` | Shown with the exports (UNBCDoor's share link). |
| `browseHref`, `onBrowse` | The host's saved-signs page, if it has one. |
| `measuringSheetsHref`, `onOpenMeasuringSheets` | The host's measuring-sheets page, if it has one. |
| `departments` | The department hierarchy; the logo kit's by default. |

## The parts

Everything the editor is built from is exported from `src/index.js`, and the parts that need no
React from `src/core.js`:

- **Artwork**: `SignArtwork` (the sign as SVG), `layoutSignArtwork`, `renderArtworkNode`.
- **Editor sections**: `SignForm`, `CredentialsSection`, `SignStyleControls`, `SignPreview`,
  `LivePreview`, `CardHolderSelector`, `DepartmentField`, `OrganizationSwitcher`, `SettingsMenu`.
- **Pages**: `SavedSignsBrowser` and `ArchiveNavigator` (archives), `MeasuringSheetsPage`.
- **Controls**: `CustomSelect`, `SegmentedControl`, `Switch`, `HolderMockup`.
- **Hooks**: `useSignState`, `useCardHolders`, `useSignArchive`, `usePrintSheet`, `useUnits`.
- **Core**: sign data and defaults, `buildSignContent`, organizations (UNBC, NUGSS), department
  paths and `departmentSelection`, roles, archives and search, geometry, print sheets, custom
  holders, units, `exportSignPNG`, `exportPrintRunPDF` and the measuring sheets.

## Styles

`src/styles/door-sign.css` imports the partials in cascade order. Every rule is scoped to
`.door-sign-app`: the tokens, theme (`.dark-mode`) and organization colours (`[data-org]`) live
on that element, and dropdown lists open inside it. An app of its own can put the class on
`<html>`; an app embedding the editor puts it on a wrapper. Write new rules unscoped if easier,
then run `npm run scope:css`; it leaves scoped rules alone, and `npm test` fails on any rule that
is not scoped.

## Fonts

The sign is set in Helvetica Neue LT Pro (`fonts/`), with the older Helvetica Neue faces for
characters LT Pro lacks; the PDF exporter embeds them. These are licensed commercial fonts,
redistributed on the same basis as UNBCDoor and the logo kit they came from. Check your licence
before relying on them in a new context.

## Development

```bash
npm install
npm run demo    # the editor on its own page (demo/)
npm test        # sign geometry, holders, archives, print sheets, roles and the package seams
```
