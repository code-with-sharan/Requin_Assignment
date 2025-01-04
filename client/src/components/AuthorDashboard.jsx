import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';

export default function AuthorDashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPost, setEditPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', newPost);
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (error) {
      setError('Error creating post');
    }
  };

  const authorPosts = posts.filter(post => post.author._id === user.id);

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditPost({ title: post.title, content: post.content });
  };

  const handleEdit = async (id) => {
    try {
      await api.put(`/posts/${id}`, {
        title: editPost.title,
        content: editPost.content,
      });
      setEditingPostId(null);
      fetchPosts();
    } catch (error) {
      setError('Error updating post');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (error) {
      setError('Error deleting post');
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (loading) return (
    <div className="text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  return (
    <Container className="py-4">
      <h1 className="mb-4">Author Dashboard</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <h2 className="mb-3">Create New Post</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">Create Post</Button>
          </Form>
        </Card.Body>
      </Card>

      <h2 className="mb-3">Your Posts</h2>
      {authorPosts.length === 0 && <p>No posts yet. Please create one!</p>}
      <Row xs={1} md={2} lg={3} className="g-4">
        {authorPosts.map(post => (
          <Col key={post._id}>
            <Card style={{ height: '400px' }}>
              <Card.Body className="d-flex flex-column">
                {editingPostId === post._id ? (
                  <>
                    <Form.Control
                      type="text"
                      className="mb-2"
                      value={editPost.title}
                      onChange={(e) => setEditPost({...editPost, title: e.target.value})}
                    />
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="mb-3 flex-grow-1"
                      style={{ height: '200px', resize: 'none' }}
                      value={editPost.content}
                      onChange={(e) => setEditPost({...editPost, content: e.target.value})}
                    />
                    <div>
                      <Button 
                        variant="success"
                        onClick={() => handleEdit(post._id)}
                        className="me-2"
                      >
                        Save
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={() => setEditingPostId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Card.Title >{post.title}</Card.Title>
                    <Card.Text 
                      className="flex-grow-1"
                      style={{ 
                        height: '200px',
                        overflow: 'auto'
                      }}
                    >
                      {post.content}
                    </Card.Text>
                    <div className="mt-auto">
                      <Button 
                        variant="outline-primary"
                        onClick={() => startEditing(post)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
} 