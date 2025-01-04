import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

export default function UserDashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );
  
  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  return (
    <Container className="py-4">
      <h1 className="mb-4">Welcome to Your Dashboard</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {posts.map(post => (
          <Col key={post._id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="h5 mb-3">{post.title}</Card.Title>
                <Card.Text>{post.content}</Card.Text>
                <Card.Footer className="text-muted bg-transparent">
                  By: {post.author.username}
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
} 