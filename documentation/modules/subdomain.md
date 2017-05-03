# Subdomain

A small bit of custom middleware to handle white listed domain names. It is passed a single object.

```
{
  whitelist: [...],
  blacklist: [...]
}
```

The white list is used to clear up okay domain names.

The black list merely blocks subdomains.

# Subdomain routes


Same as routes but for subdomains. Only works with the `subdomain` module as a middleware.
