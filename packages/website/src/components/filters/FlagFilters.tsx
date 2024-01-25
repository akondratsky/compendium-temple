import { Checkbox, Flex } from 'antd';
import { observer } from 'mobx-react-lite';
import { filter } from '../../store/filter';
import { search } from '../../services/repos';

export const FlagFilters = observer(() => {
  return (
    <Flex vertical style={{ gap: 8 }}>
      <Checkbox
        checked={filter.flags.onlyWithIssuesEnabled}
        onChange={(e) => {
          filter.flags.setOnlyWithIssuesEnabled(e.target.checked);
          search.new();
        }}
      >
        Only with issues enabled
      </Checkbox>
      
      <Checkbox
        checked={filter.flags.onlyWithProjectsEnabled}
        onChange={(e) => {
          filter.flags.setOnlyWithProjectsEnabled(e.target.checked);
          search.new();
        }}
      >
        Only with projects enabled
      </Checkbox>

      <Checkbox
        checked={filter.flags.onlyWithWikiEnabled}
        onChange={(e) => {
          filter.flags.setOnlyWithWikiEnabled(e.target.checked);
          search.new();
        }}
      >
        Only with wiki enabled
      </Checkbox>

      <Checkbox
        checked={filter.flags.onlyWithDownloads}
        onChange={(e) => {
          filter.flags.setWithDownloads(e.target.checked);
          search.new();
        }}
      >
        Only with downloads
      </Checkbox>

      <Checkbox
        checked={filter.flags.onlyWithDiscussionsEnabled}
        onChange={(e) => {
          filter.flags.setOnlyWithDiscussionsEnabled(e.target.checked);
          search.new();
        }}
      >
        Only with discussions enabled
      </Checkbox>

      <Checkbox
        checked={filter.flags.skipDisabled}
        onChange={(e) => {
          filter.flags.setSkipDisabled(e.target.checked);
          search.new();
        }}
      >
        Skip disabled
      </Checkbox>

      <Checkbox
        checked={filter.flags.skipArchived}
        onChange={(e) => {
          filter.flags.setSkipArchived(e.target.checked);
          search.new();
        }}
      >
        Skip archived
      </Checkbox>

      <Checkbox
        checked={filter.flags.forkingOnlyAllowed}
        onChange={(e) => {
          filter.flags.setForkingOnlyAllowed(e.target.checked);
          search.new();
        }}
      >
        Only with allowed forking
      </Checkbox>
    </Flex>
  );
});