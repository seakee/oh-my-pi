Execute a mounted `xd://` tool device: `path` is `xd://<tool>` and `content` is the device's JSON argument object. `read xd://` lists the mounted devices, and `read xd://<tool>` shows one device's full documentation.

It also writes `local://` session scratch files (reports, drafts, notes). Every other path, including the working tree and other internal URLs, is rejected.
