import millify from 'millify';
import dayjs from 'dayjs';
import { PropsWithChildren } from 'react';
import { Flags } from '../../store/searchResults';

const Flag = ({ enabled, children }: PropsWithChildren<{ enabled: boolean | null }>) => {
  return enabled ? <li>{children}</li> : null
};

export const renderFlags = (flags: Flags) => (
  <ul style={{ paddingLeft: 14 }}>
    <Flag enabled={flags.hasDiscussions}>discussions</Flag>
    <Flag enabled={flags.hasIssues}>issues</Flag>
    <Flag enabled={flags.hasProjects}>projects</Flag>
    <Flag enabled={flags.hasWiki}>wiki</Flag>
    <Flag enabled={flags.isArchived}>archived</Flag>
    <Flag enabled={flags.isDisabled}>disabled</Flag>
    <Flag enabled={flags.isFork}>fork</Flag>
  </ul>
);

export const renderCount = (count: number) => count === null ? '?' : millify(count);

export const renderDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');
