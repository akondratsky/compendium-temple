import { Space, TableProps, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { Repo } from '../../store/searchResults';
import { renderCount, renderDate, renderFlags } from './renderers';

export const columns: TableProps<Repo>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'fullName',
    width: 200,
    render: (fullName: string, repo: Repo) => (
      <Link to={repo.htmlUrl} target='_blank'>{fullName}</Link>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: 350,
  },
  {
    title: 'Lang',
    width: 60,
    dataIndex: 'language',
    render: (language: string) => {
      return {
        'JavaScript': 'JS',
        'TypeScript': 'TS',
      }[language];
    },
  },
  {
    title: 'Dependencies',
    dataIndex: 'dependencies',
    width: 450,
    render: (dependencies: string[]) => (
      <Space style={{ gap: 4, minWidth: 80 }} wrap>
        {!dependencies.length && <>no dependencies</>}
        {dependencies.map((dep) => (
          <Tag key={dep} style={{ margin: 0 }}>{dep}</Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Stars',
    width: 80,
    dataIndex: 'stargazersCount',
    render: renderCount,
  },
  {
    title: 'Forks',
    width: 80,
    dataIndex: 'forksCount',
    render: renderCount,
  },
  {
    title: 'Issues',
    width: 80,
    dataIndex: 'openIssuesCount',
    render: renderCount,
  },
  {
    title: 'Flags',
    width: 120,
    dataIndex: 'flags',
    render: renderFlags,
  },
  {
    title: 'Created',
    width: 120,
    dataIndex: 'createdAt',
    render: renderDate,
  },
  {
    title: 'Updated',
    width: 120,
    dataIndex: 'updatedAt',
    render: renderDate,
  },
  {
    title: 'Pushed',
    width: 110,
    dataIndex: 'pushedAt',
    render: renderDate,
  },
];