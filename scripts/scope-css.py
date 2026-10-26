"""Scope the editor's stylesheets under .door-sign-app, so they style the editor wherever it is
placed and never the host page around it. :root, html and body rules move onto the scope itself
(where the tokens, theme class and data-org live); every other selector is prefixed with it.

Run once over src/styles after editing a stylesheet that was written unscoped:
    python3 scripts/scope-css.py src/styles/*.css
It is idempotent: selectors already starting with the scope are left alone."""
import re
import sys

SCOPE = '.door-sign-app'
ROOT = re.compile(r'^(?::root|html|body)(?![\w-])')


def scope_selector(selector):
    selector = selector.strip()
    if not selector or selector.startswith(SCOPE):
        return selector
    if ROOT.match(selector):
        return ROOT.sub(SCOPE, selector, count=1)
    return f'{SCOPE} {selector}'


def scope(css):
    out, depth_kinds, i, start = [], [], 0, 0
    # Walk the text; at each '{' decide whether the prelude is a selector list to scope.
    while i < len(css):
        char = css[i]
        if css.startswith('/*', i):
            end = css.index('*/', i) + 2
            i = end
            continue
        if char == '{':
            prelude = css[start:i]
            stripped = re.sub(r'/\*[\s\S]*?\*/', '', prelude).strip()
            # Only rules at the top level or inside @media/@supports are selectors.
            inside_rule = any(kind == 'rule' or kind == 'opaque' for kind in depth_kinds)
            if stripped.startswith('@'):
                kind = 'group' if re.match(r'@(media|supports|layer|container)\b', stripped) else 'opaque'
                out.append(prelude)
            elif inside_rule:
                kind = 'opaque'
                out.append(prelude)
            else:
                kind = 'rule'
                # Keep the comments and whitespace before the selector list.
                lead = prelude[:len(prelude) - len(prelude.lstrip())]
                body = prelude.strip()
                comments = ''
                while body.startswith('/*'):
                    end = body.index('*/') + 2
                    comments += body[:end] + '\n'
                    body = body[end:].lstrip()
                out.append(lead + comments + ', '.join(scope_selector(part) for part in split_selectors(body)) + ' ')
            depth_kinds.append(kind)
            out.append('{')
            i += 1
            start = i
            continue
        if char == '}':
            out.append(css[start:i])
            out.append('}')
            if depth_kinds:
                depth_kinds.pop()
            i += 1
            start = i
            continue
        if char == ';' and not any(kind == 'rule' for kind in depth_kinds):
            # @import and @charset at the top level.
            out.append(css[start:i + 1])
            i += 1
            start = i
            continue
        i += 1
    out.append(css[start:])
    return ''.join(out)


def split_selectors(text):
    parts, depth, current = [], 0, ''
    for char in text:
        if char in '([':
            depth += 1
        elif char in ')]':
            depth -= 1
        if char == ',' and depth == 0:
            parts.append(current)
            current = ''
        else:
            current += char
    parts.append(current)
    return parts


if __name__ == '__main__':
    for path in sys.argv[1:]:
        with open(path) as handle:
            css = handle.read()
        with open(path, 'w') as handle:
            handle.write(scope(css))
