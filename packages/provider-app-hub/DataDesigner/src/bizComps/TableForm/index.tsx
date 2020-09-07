import React from "react";
import PropTypes from "prop-types";

import {
  Form, Input, Table, Select, AutoComplete, Space, Row
} from "antd";

import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

class SetMapping extends React.Component {
  static propTypes = {
    form: PropTypes.shape({}).isRequired,
    appnameList: PropTypes.arrayOf(String),
    tagList: PropTypes.arrayOf(String)
  };

  state = {
    mappingState: [],
    appnameList: [],
    tagList: []
  };

  componentDidMount() {

  }

  syslogIPValidator = () => ({
    validator: (rule, value, callback) => {
      if (value && value.trim() !== "") {
        const reg = /^(\d{1,3}|\*)\.(\d{1,3}|\*)\.(\d{1,3}|\*)\.(\d{1,3}|\*)$/i;
        if (!reg.test(value.trim())) {
          callback("IP地址格式错误");
        } else if (this.checkIfExistedIP(value)) {
          callback("IP地址重复");
        } else {
          callback();
        }
      }
    }
  });

  checkIfExistedIP = (value) => {
    const { form } = this.props;
    const { getFieldValue } = form;
    const mapping = getFieldValue("mapping") || [];

    const mappingArray = mapping ? mapping.filter((one) => one.ip === value) : [];
    if (mappingArray.length > 1) {
      return true;
    }
    return false;
  };

  addOneMapping = () => {
    const { form } = this.props;
    const { getFieldsValue, validateFields } = form;
    const { mappingState } = this.state;
    const mapping = getFieldsValue().mapping || mappingState;
    if (mapping && mapping.length !== 0) {
      validateFields(["mapping"], { force: true }, (errors) => {
        if (!errors) {
          mapping.push({
            ip: "",
            appname: "",
            tag: "",
            charset: ""
          });
          this.setState({ mappingState: mapping });
        }
      });
    } else {
      mapping && mapping.push({
        ip: "",
        appname: "",
        tag: "",
        charset: ""
      });
      this.setState({ mappingState: mapping });
    }
  };

  removeOneMapping = (index) => {
    const { form } = this.props;
    const { getFieldValue } = form;

    const mapping = getFieldValue("mapping");
    mapping.splice(index, 1);

    this.setState({
      mappingState: mapping
    });
    form.setFieldsValue({
      mapping
    });
  };

  render() {
    const { mappingState } = this.state;
    const { form, appnameList, tagList } = this.props;
    const { getFieldDecorator } = form;

    const PLACEHOLDER = "请输入";

    const tableTitle = [
      {
        title: "ip",
        dataIndex: "ip",
        key: "ip",
        width: 205,
        render: (ip, one, index) => (
          <Form.Item>
            {getFieldDecorator(`mapping[${index}].ip`, {
              initialValue: ip || "",
              validateFirst: true,
              validateTrigger: ["onChange", "onFocus"],
              rules: [
                {
                  required: true,
                  message: "请输入IP地址"
                },
                this.syslogIPValidator()
              ]
            })(
              <Input
                size="small"
                style={{ width: "170px" }}
                autoComplete="off"
                placeholder={PLACEHOLDER}
              />
            )}
          </Form.Item>
        )
      },
      {
        title: "appname",
        dataIndex: "appname",
        key: "appname",
        width: 205,
        render: (appname, one, index) => (
          <Form.Item>
            {getFieldDecorator(`mapping[${index}].appname`, {
              initialValue: appname || "",
              validateFirst: true,
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  message: "请输入 appname"
                }
              ]
            })(
              <AutoComplete
                size="small"
                dataSource={appnameList}
                style={{ width: "170px" }}
                placeholder={PLACEHOLDER}
                filterOption={(inputValue, option) => option.props.children
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            )}
          </Form.Item>
        )
      },
      {
        title: "tag",
        dataIndex: "tag",
        key: "tag",
        width: 205,
        render: (tag, one, index) => (
          <Form.Item>
            {getFieldDecorator(`mapping[${index}].tag`, {
              initialValue: tag || "",
              validateFirst: true,
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  message: "请输入 tag"
                }
              ]
            })(
              <AutoComplete
                size="small"
                dataSource={tagList}
                style={{ width: "170px" }}
                placeholder={PLACEHOLDER}
                filterOption={(inputValue, option) => option.props.children
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            )}
          </Form.Item>
        )
      },
      {
        title: "charset",
        dataIndex: "charset",
        key: "charset",
        width: 110,
        render: (charset, one, index) => (
          <Form.Item>
            {getFieldDecorator(`mapping[${index}].charset`, {
              initialValue: charset || "utf-8"
            })(
              <Select size="small">
                <Select.Option value="utf-8" style={{ fontSize: 12 }}>
                  utf-8
                </Select.Option>
                <Select.Option value="gbk" style={{ fontSize: 12 }}>
                  gbk
                </Select.Option>
              </Select>
            )}
          </Form.Item>
        )
      },
      {
        title: "操作",
        key: "operation",
        width: 60,
        render: (operation, one, index) => (
          <Space>
            <PlusOutlined
              style={{ height: "42px" }}
              type="add"
              onClick={() => this.addOneMapping()}
            />
            <MinusOutlined
              style={{ height: "42px" }}
              type="delete"
              onClick={() => this.removeOneMapping(index)}
            />
          </Space>
        )
      }
    ];

    return (
      <div className="setMapping">
        <Table
          bordered
          size="small"
          className="tableBody"
          rowKey={(row) => row.id}
          columns={tableTitle}
          dataSource={mappingState}
          pagination={false}
        />
      </div>
    );
  }
}

const [TableForm] = Form.useForm({ name: "register" });
export { TableForm };
