import { Card, Typography } from 'antd';
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
        {repo.description ?? <NoDescription /> }
      </Typography.Paragraph>
    </Card>
  )
};
