import { Card, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Repo } from '../store/searchResults';

type RepoCardProps = {
  repo: Repo;
};


const NoDescription = () => (
  <Typography.Text italic>
    &lt;no description&gt;
  </Typography.Text>
);

export const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <Card>
      <Typography.Title level={5}>
        <Link to={repo.htmlUrl} target='_blank'>{repo.fullName}</Link>
      </Typography.Title>
      <Typography.Paragraph>
        Description: {repo.description ?? <NoDescription /> }
      </Typography.Paragraph>
      <Typography.Paragraph>
        Language: {repo.language ?? 'null'}
      </Typography.Paragraph>
      <Space wrap>
        {repo.dependencies.map((dep) => (
          <Tag key={dep} style={{ margin: 0 }}>{dep}</Tag>
        ))}
      </Space>
    </Card>
  )
};
