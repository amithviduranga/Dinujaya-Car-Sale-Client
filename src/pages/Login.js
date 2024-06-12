import React from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function App() {
  const { token } = useToken();
  const screens = useBreakpoint();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: "50px", // Added padding for the entire container
      width: "500px", // Increased width
      border: `1px solid ${token.colorBorder}`,
      borderRadius: token.borderRadiusLG,
      backgroundColor: token.colorBgContainer,
      textAlign: "center",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXXL, // Increased bottom margin
    },
    section: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
      backgroundColor: token.colorBgLayout,
    },
    text: {
      color: token.colorTextSecondary,
      fontSize: screens.md ? token.fontSizeLG : token.fontSizeMD, // Increased font size
    },
    boldText: {
      fontWeight: "bold",
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading1 : token.fontSizeHeading2, // Increased font size
    },
    input: {
      height: "48px", // Increased input field height
      fontSize: token.fontSizeLG, // Increased input field font size
    },
    button: {
      height: "48px", // Increased button height
      fontSize: token.fontSizeLG, // Increased button font size
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
            <path
              d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
              fill="white"
            />
            <path
              d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
              fill="white"
            />
            <path
              d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
              fill="white"
            />
          </svg>

          <Title style={styles.title}>Welcome <br></br> Dinujaya Car Sale</Title>
          <Text style={styles.text}>
            Welcome back to <span style={styles.boldText}>Dinujaya Car Sale</span>! <br></br>Please enter your details below to sign in.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              style={styles.input}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              style={styles.input}
            />
          </Form.Item>
        
          <Form.Item style={{ margin: "30px 0" }}> {/* Adjusted margin */}
            <Button block type="primary" htmlType="submit" style={styles.button}>
              Log in
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Don't have an account?</Text>{" "}
              <Link href="/register">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
