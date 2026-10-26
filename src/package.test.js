// The package's own seams: a department named by a host, the scoped stylesheet and the entry
// points, which must not reach outside the package.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { departmentSelection, resolveDepartmentPath } from './sign/departmentPath.js'
import { departmentTypes } from '../vendor/unbc-logo/src/departments/departmentData.js'

test('a host can open the editor on a department named elsewhere', () => {
  const listed = departmentSelection(departmentTypes, 'School of Engineering')
  assert.equal(resolveDepartmentPath(departmentTypes, listed).path.at(-1), 'School of Engineering')
  assert.equal(resolveDepartmentPath(departmentTypes, listed).custom, '')
  const unlisted = departmentSelection(departmentTypes, 'Northern Hub for Health Research')
  assert.equal(resolveDepartmentPath(departmentTypes, unlisted).custom, 'Northern Hub for Health Research', 'an unlisted name still prints')
})

test('every style rule is scoped to .door-sign-app', () => {
  const folder = new URL('./styles/', import.meta.url)
  for (const file of readdirSync(folder).filter(name => name.endsWith('.css') && name !== 'door-sign.css')) {
    const css = readFileSync(new URL(file, folder), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    // Selectors outside @-rule preludes and keyframe steps.
    for (const [, prelude] of css.matchAll(/(?:^|[;}])\s*([^{};@]+?)\s*\{/g)) {
      if (/^(from|to|\d+%)/.test(prelude)) continue
      for (const selector of prelude.split(',')) assert.match(selector.trim(), /^\.door-sign-app\b/, `${file}: ${selector.trim()}`)
    }
  }
})

test('the source never reaches outside the package', () => {
  const files = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(new URL(`${entry.name}/`, dir))
      else if (/\.(js|jsx)$/.test(entry.name)) files.push(new URL(entry.name, dir))
    }
  }
  walk(new URL('./', import.meta.url))
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    for (const [, specifier] of source.matchAll(/from '([^']+)'/g)) {
      assert.doesNotMatch(specifier, /^@unbc\/|data\/door-sign-archive|json-url/, `${file.pathname}: ${specifier}`)
    }
  }
})
