import { useEffect, useState } from 'react';
import { RepoSearchResult, RepoSearchResultItem } from '@compendium-temple/api';
import { RepoCard } from '../components/RepoCard';
import { searchRepos } from '../services/repos';
import { PaginationPanel } from './PaginationPanel';

export const SearchResults = () => {
  const [repos, setRepos] = useState<RepoSearchResultItem[]>([]);

  useEffect(() => {
    // searchRepos().then(setRepos);
  }, []);

  return (
    <>
      <PaginationPanel />
      {repos.map((repo) => (
        <RepoCard key={repo.fullName} repo={repo} />
      ))}
    </>
  )
}