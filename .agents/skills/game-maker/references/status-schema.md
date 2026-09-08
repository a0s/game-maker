# docs/STATUS.json

The single resume point. Read first on every iteration, written by the
orchestrator after every report. Keep it small enough to read whole.

```json
{
  "project": "<neutral working title>",
  "genre": "<from REFERENCE.md>",
  "reference": "docs/REFERENCE.md",
  "brief": "docs/BRIEF.md",
  "threshold": 8.5,
  "roundCap": 4,
  "bestTag": "wave-3",
  "hardware": {"gpu": "Apple M2 Pro", "browser": "Chrome 1xx"},
  "wave": 3,
  "modules": {
    "<module>": {
      "state": "fail",
      "score": 7.5,
      "history": [5.0, 6.5, 7.5],
      "round": 3,
      "visibility": 1.0,
      "lastReview": "docs/reviews/<module>/r3.md",
      "captures": ["r3-night-2200", "r3-wide-1200"],
      "openIssues": [
        {"rank": 1, "capture": "r3-night-2200", "region": "ground plane centre", "severity": "high",
         "ref": "REFERENCE.light L4", "text": "flat albedo, uniform roughness, hard light pool"}
      ],
      "coreRequests": ["docs/core-requests/<module>-2.md"],
      "errors": 0, "warnings": 2, "drawCalls": 812
    },
    "audio": {
      "state": "ceiling",
      "score": 7.0,
      "history": [6.0, 7.0, 7.0, 7.0],
      "reason": "no CC0 ambience set found under the size cap; procedural bed lacks low-end",
      "visibility": 0.3
    }
  },
  "finalGate": {"ran": false},
  "judging": {"ran": false},
  "nextAction": "<module> round 4",
  "updatedAt": "ISO"
}
```

States: `todo`, `building`, `fail`, `pass`, `ceiling`, `blocked` (waiting on a
core request). `nextAction` is what the orchestrator will do first on resume,
so a fresh session needs no re-derivation.

Expected gain for picking the next module:
`(threshold - score) × visibility`, skipping `pass` and `ceiling`, preferring
`blocked` modules whose core request the integrator has since applied.
