Publish the canonical result of the current security scan.
Call it exactly once, after every in-scope file and candidate has reached its final disposition.
Evidence: only the repository files inspected during this scan.
The tool validates, fingerprints, assigns its own IDs, writes the canonical security store, and creates SARIF.
Never invent IDs or edit the store directly.
