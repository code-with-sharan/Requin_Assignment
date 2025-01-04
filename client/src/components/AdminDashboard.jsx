import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [usersResponse, postsResponse] = await Promise.all([
        api.get('/users'),
        api.get('/posts')
      ]);
      setUsers(usersResponse.data);
      setPosts(postsResponse.data);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      fetchData(); // Refresh data after update
    } catch (err) {
      setError(err.message || 'Error updating user role');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      fetchData(); // Refresh data after deletion
    } catch (err) {
      setError(err.message || 'Error deleting post');
    }
  };

  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;
  if (loading) return (
    <div className="text-center p-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Card className="mb-4">
        <Card.Header>
          <h2 className="h4 mb-0">Users Management</h2>
        </Card.Header>
        <Card.Body>
          <Row xs={1} md={2} lg={3} className="g-4">
            {users.map(user => (
              <Col key={user._id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{user.username}</Card.Title>
                    <Card.Text>Email: {user.email}</Card.Text>
                    <Form.Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="mb-2"
                    >
                      <option value="user">User</option>
                      <option value="author">Author</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="h4 mb-0">All Posts</h2>
        </Card.Header>
        <Card.Body>
          <Row xs={1} md={2} lg={3} className="g-4">
            {posts.map(post => (
              <Col key={post._id}>
                <Card style={{ height: '400px' }}>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text 
                      className="flex-grow-1"
                      style={{ 
                        height: '200px',
                        overflow: 'auto'
                      }}
                    >
                      {post.content}
                    </Card.Text>
                    <Card.Footer className="bg-transparent px-0 mt-auto">
                      <small className="text-muted d-block mb-2">By: {post.author.username}</small>
                      <Button 
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </Button>
                    </Card.Footer>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
} 