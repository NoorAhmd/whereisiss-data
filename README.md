# whereisiss-data

Orbital elements (GP / OMM) for [whereisiss.com](https://whereisiss.com), mirrored from
[CelesTrak](https://celestrak.org) every 2 hours by a GitHub Action.

CelesTrak publishes new element sets about every 2 hours and allows one download per group
per IP in that window. Serving one shared copy keeps every visitor within that limit,
including people on shared networks.

Files live on the [`data`](../../tree/data) branch:

```
https://raw.githubusercontent.com/NoorAhmd/whereisiss-data/data/gp/<group>.json
```

Groups: `stations`, `science`, `resource`, `weather`, `active`.

Each file is `{ group, fetched, rows }`, and each row is
`[noradId, name, objectId, epoch, meanMotion, eccentricity, inclination, raan, argOfPericenter, meanAnomaly, bstar, meanMotionDot, meanMotionDdot, revAtEpoch]`.

Data: CelesTrak (Dr. T.S. Kelso). Please follow CelesTrak's usage guidelines if you reuse it.
