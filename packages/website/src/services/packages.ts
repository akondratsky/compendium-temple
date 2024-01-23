import { Package } from '@compendium-temple/api';
import { api } from '../api';

export const searchPackages = async (searchString: string) => {
  const { data } = await api.get<Package[]>(`/packages?search=${searchString}`);
  return data.map(({ id, name }) => ({
    value: String(id),
    label: name,
  }));
}