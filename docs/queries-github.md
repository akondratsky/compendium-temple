## Rate limit

```gql
query { 
  viewer {
    login
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}
```

## Repository

```gql
{
  repository(name: "compendium", owner:"akondratsky") {
    id
    databaseId
    description
    name
    
    diskUsage
    forkCount
    
    hasDiscussionsEnabled
    hasIssuesEnabled
    hasProjectsEnabled
    hasVulnerabilityAlertsEnabled
    hasWikiEnabled
    isArchived
    isDisabled
    isEmpty
    isFork
    isInOrganization
    isLocked
    isMirror
    isTemplate
    
    homepageUrl
    licenseInfo {
      id
    }
    
    parent {
      id # parent repo id if this is fork
    }
    
    primaryLanguage {
      id
    }
    
    stargazerCount
    
    templateRepository {
      id
    }
    
    # pullRequests
    # languages
    # project
    # owner
    
    # object
    openGraphImageUrl
    # packages

    isTemplate
    templateRepository {
      id
    }
  }
}
```


- [Search for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)




```json
{
  "SPDXID": "SPDXRef-npm-badisi-latest-version-6.1.7",
  "name": "npm:@badisi/latest-version",
  "versionInfo": "6.1.7",
  "downloadLocation": "NOASSERTION",
  "filesAnalyzed": false,
  "licenseConcluded": "NOASSERTION",
  "licenseDeclared": "NOASSERTION",
  "supplier": "NOASSERTION",
  "externalRefs": [
    {
      "referenceCategory": "PACKAGE-MANAGER",
      "referenceLocator": "pkg:npm/%40badisi/latest-version@6.1.7",
      "referenceType": "purl"
    }
  ]
}
```

```json
{
  "SPDXID": "SPDXRef-npm-babel-plugin-syntax-numeric-separator-7.10.4",
  "name": "npm:@babel/plugin-syntax-numeric-separator",
  "versionInfo": "7.10.4",
  "downloadLocation": "NOASSERTION",
  "filesAnalyzed": false,
  "licenseConcluded": "MIT",
  "licenseDeclared": "NOASSERTION",
  "supplier": "NOASSERTION",
  "externalRefs": [
    {
      "referenceCategory": "PACKAGE-MANAGER",
      "referenceLocator": "pkg:npm/%40babel/plugin-syntax-numeric-separator@7.10.4",
      "referenceType": "purl"
    }
  ]
}
```
