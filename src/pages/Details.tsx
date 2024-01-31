import { useParams } from 'react-router-dom';
export const Component = () => {
  const { id, name } = useParams();
  return (
    <div>
      <span>
        参数的值：{id} {name}
      </span>
    </div>
  );
};
Component.displayName = 'DetailsPage';
