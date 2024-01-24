import { RepoCard } from '../components/RepoCard';
import { searchResults } from '../store/searchResults';
import { ResultsControlPanel } from './ResultsControlPanel';
import { observer } from 'mobx-react-lite';

export const SearchResults = observer(() => {
  return (
    <>
      <ResultsControlPanel />
      {[...searchResults.repos].map((repo) => (
        <RepoCard key={repo.fullName} repo={repo} />
      ))}
    </>
  )
});
