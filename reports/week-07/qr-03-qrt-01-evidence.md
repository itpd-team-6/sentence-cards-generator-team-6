# QRT-01 Of QR-03: Result Of The Run On The University VM

The test [`QRT-01`](../../docs/quality-requirements/qr/QR-03.md#qrt-01) of [`QR-03`](../../docs/quality-requirements/qr/QR-03.md) passed on 2026-11-15.

## The run

- **Date:** 2026-11-15, at 14:30:35 UTC.
- **Run by:** nataliamotand, from a machine on the university network, over SSH on the university VM.
- **Commit:** `75ea88aaba1a8db127689d1324c1c69500cec8a2`, the head of `main` at that time, cloned into a new temporary folder.
- **Machine:** the university VM, with Python 3.12.3 and Node v22.23.4.
- **Command:** `bash scripts/check-install.sh`, from the root of that clone.
- **Result:** passed, with exit code 0.

## What the script printed

```text
Cloning into 'repo'...
COMMIT: 75ea88aaba1a8db127689d1324c1c69500cec8a2
DATE: 2026-11-15T14:30:35Z
Python 3.12.3
v22.23.4
133 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

> sentence-cards-frontend@0.1.0 build
> vite build

vite v8.3.4 building client environment for production...
transforming...
✓ 51 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.40 kB │ gzip:  0.27 kB
dist/assets/index-DJfcH3He.css   50.13 kB │ gzip:  9.72 kB
dist/assets/index-lUhgxBWK.js   321.19 kB │ gzip: 95.69 kB

✓ built in 327ms

==> Copy .env from .env.example

==> Start the backend on a free port

==> Wait for the backend to answer

==> Open the health route /api/health

==> Open the start page /

The product installed, started and answered. QR-03 install check passed.
EXIT CODE: 0
CLEANED: yes
```

## What the run shows, and what it does not

The run shows that the steps of `docs/setup.md` install the product on a clean Linux machine, start the backend on a free port, and make the start page and `/api/health` answer.
It does not show that a person outside the team can follow the file alone, because a script ran the steps and not a person.
The temporary folder was deleted after the run, and the staging and production deployments were not touched.
