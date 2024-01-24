import { Button, Flex, Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { filter } from '../../store/filter';
import { throttle } from 'lodash';
import { search } from '../../services/repos';

const throttledSearch = throttle(search.new, 500);

export const DescriptionFilter = observer(() => {
  return (
    <Flex>
      <Input
        value={filter.description}
        onChange={(e) => {
          filter.setDescription(e.target.value);
          throttledSearch();
        }}
        placeholder='Search in description'
      />
      <Button
        size="middle"
        type="primary"
        style={{ marginLeft: 8 }}
        onClick={() => filter.setDescription('')}
      >
        Reset
      </Button>
    </Flex>

  );
});
