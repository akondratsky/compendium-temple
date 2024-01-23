import { PackageInput } from './components/PackageInput';

export const App = () => {
  return (
    <PackageInput onSelect={(value) => console.log('selected', value)} />
  );
};
