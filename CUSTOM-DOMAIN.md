# Custom domain cutover

Target canonical address: https://yitingl.com
The www variant will redirect to the apex via GitHub Pages once both DNS names are configured.

This branch is preparation only. Do not merge it until ready to coordinate the DNS change. Main remains the live publishing branch.

## Squarespace DNS

Replace existing A records for @ with these four records:

| Host | Type | Value |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | yitinglin919.github.io |

Replace the existing www CNAME pointing to ext-sq.squarespace.com. Do not add a duplicate CNAME. Leave TTL at its default. Do not change nameservers, MX, TXT, or unrelated records. No Squarespace URL-forwarding rule is needed.

No AAAA record is required. If existing apex AAAA records are present at cutover, they must not continue pointing to a different host; inspect them before changing anything.

## Coordinated activation

1. Keep the existing working site available while preparing the DNS editor.
2. At cutover, add yitingl.com in repository Settings > Pages > Custom domain, then save the prepared Squarespace DNS records promptly. GitHub recommends registering the custom domain before pointing DNS to Pages.
3. Synchronize this CNAME file to main, accounting for any commit created by GitHub's Pages settings. Do not overwrite concurrent changes.
4. Check authoritative and public DNS, GitHub's domain validation, and the HTTPS certificate. Certificate provisioning and DNS propagation may take up to 24 hours; uninterrupted access cannot be guaranteed during this change.
5. Once available, enable Enforce HTTPS. Verify both https://yitingl.com and https://www.yitingl.com and the redirect to the apex. Check images and navigation.

The local preparation script preserves CNAME when copying content updates.

Official instructions: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
