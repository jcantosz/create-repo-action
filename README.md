Create either an empty repo or a repo from a template

allow auth with `pat` or `app` token

- if auth with `pat` can create repo from template or empty
- if auth with `app` token, cannot create repo from template (API does not allow)

Does the following

1. auth and determine if provided a `pat` or `app` config (if both provided, `app` gets used)
1. if using template make sure both org and repo of template are set
1. check if repo already exists
1. create repo (from template or empty)
