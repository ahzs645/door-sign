// The door sign without React or a browser: its data, content, geometry, archives, print sheets
// and holders, as plain modules that run in Node too (tests, build scripts). The exporters and
// measuring sheets need a browser and its fonts, so they are exported from index.js only.

export { INITIAL_SIGN_DATA } from './sign/signData.js'
export { buildSignContent } from './sign/signContent.js'
export { getDefaultValues, NAME_TITLES, emailFromName, resolveSignValues } from './sign/signDefaults.js'
export { ORGANIZATIONS, ORGANIZATION_KEYS, DEFAULT_ORGANIZATION, resolveOrganization, switchOrganization } from './sign/organizations.js'
export { DEPARTMENT_LEVELS, departmentChildren, departmentAreaName, findDepartmentPath, resolveDepartmentPath, selectDepartmentLevel, departmentSelection } from './sign/departmentPath.js'
export { ROLE_UNIT_LAYOUTS, ROLE_TITLE_LAYOUTS, ROLE_UNIT_DIVIDERS, EMPTY_ROLE, normalizeRole, normalizeRoles, splitRoleTitle, separateRoleUnit } from './sign/signRoles.js'
export { SIGN_ARCHIVE_FORMAT, SIGN_ARCHIVE_VERSION, normalizeSignData, createSignArchive, parseSignArchive } from './sign/signArchive.js'
export { SIGN_TYPE_LABELS, filterSignEntries, describeSignEntry, countSignTypes, signDataDiffers } from './sign/signArchiveSearch.js'
export { PT_PER_INCH, ROOM_SIGN_TYPES, BLEED_INCHES, SAFE_INCHES, DEFAULT_INSERT_SIZE, PAPER_DIMENSIONS, PAPER_ORDER } from './sign/signConstants.js'
export { formatInches, resolveCardHolderGeometry, getPrintLayout } from './sign/signGeometry.js'
export { resolveHeaderGeometry } from './sign/headerGeometry.js'
export { SHEET_LAYOUTS, SHEET_SPACINGS, CUT_GUIDES, DEFAULT_SHEET_OPTIONS, resolvePrintSheet, paginatePrintRun } from './sign/printSheet.js'
export { CUSTOM_HOLDERS_KEY, validateCustomHolder, toCardHolder, toCustomRecord, parseCustomHolders, serializeCustomHolders, readCustomHolders, writeCustomHolders } from './sign/customHolders.js'
export { holdersToFile, holdersFromFile, holderFileName } from './sign/holderExport.js'
export { UNIT_CHOICES, DEFAULT_UNITS, toMillimetres, formatLength, formatSize } from './sign/units.js'
export { cardHolders } from './data/cardHolders.js'
