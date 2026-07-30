# Vendored fonts

These `.woff2` files are self-hosted rather than requested from Google Fonts.
Serving from `fonts.gstatic.com` sends every visitor's IP address to Google on
page load, which EU courts have treated as a GDPR problem, and this site's
audience is entirely Dutch. Self-hosting also removes a third-party DNS lookup
and TLS handshake from the LCP critical path.

## Provenance

Each file is the **latin, weight-axis variable** build extracted from its
Fontsource npm package. The packages were installed once, the file copied into
this directory, and the packages then removed — so nothing is fetched at build
or run time.

| File                                     | Source package                      | Axis      | Licence |
| ---------------------------------------- | ----------------------------------- | --------- | ------- |
| `figtree-latin-wght-normal.woff2`         | `@fontsource-variable/figtree`          | `300 900` | OFL-1.1 |
| `inter-latin-wght-normal.woff2`           | `@fontsource-variable/inter`            | `100 900` | OFL-1.1 |
| `manrope-latin-wght-normal.woff2`         | `@fontsource-variable/manrope`          | `200 800` | OFL-1.1 |
| `plus-jakarta-sans-latin-wght-normal.woff2` | `@fontsource-variable/plus-jakarta-sans` | `200 800` | OFL-1.1 |
| `jetbrains-mono-latin-wght-normal.woff2`  | `@fontsource-variable/jetbrains-mono`   | `100 800` | OFL-1.1 |

All five are licensed under the SIL Open Font License 1.1, which permits
embedding and redistribution in this form. No attribution is required in the
rendered page.

## Status

`figtree` and `jetbrains-mono` are the **active** faces and ship on every route.

`inter`, `manrope` and `plus-jakarta-sans` are **candidates**, referenced only by
the `/design-system/` route so the client can compare them in his own Dutch copy.
Once he chooses, delete the three unused files, their entries in
`src/lib/fonts.ts`, and the rows above.

## Refreshing a file

```bash
npm i @fontsource-variable/<name>
cp node_modules/@fontsource-variable/<name>/files/<name>-latin-wght-normal.woff2 src/fonts/
npm uninstall @fontsource-variable/<name>
```
