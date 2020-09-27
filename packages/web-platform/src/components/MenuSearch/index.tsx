import React, { ReactElement, useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import "./index.less";

const { Search } = Input;

interface ISearchProps {
  onSearch?: (value) => void;
  onSelect?: (value) => void;
}
const MenuSearch: React.FC<ISearchProps> = (props): ReactElement => {
  const { onSearch, onSelect } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const handleSearch = (value) => {
    onSearch && onSearch(value);
  };
  const handleSearchOutlined = () => {
    setVisible(true);
    onSelect && onSelect(true);
  };
  const handleBlur = (e) => {
    const { value } = e.target;
    if (value === "") {
      setVisible(false);
      onSelect && onSelect(false);
    }
  };
  return (
    <div className="search">
      {
        visible ? <Search
          onSearch={handleSearch}
          onBlur={handleBlur}
        />
          : <SearchOutlined
            key="Icon"
            className="icon-menu"
            onClick={handleSearchOutlined}
          />
      }

    </div>
  );
};

export default React.memo(MenuSearch);
