import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { extractData } from '../scripts/domain-hunter-helper';

interface BlogPostProps {
  // Add any props needed for this component
}

const BlogPost: React.FC<BlogPostProps> = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState({});

  useEffect(() => {
    // Fetch data from API or database
    const fetchData = async () => {
      try {
        const extractedData = extractData();
        setData(extractedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleExtractData = () => {
    // Call the extractData function from the domain-hunter-helper script
    const extractedData = extractData();
    console.log(extractedData);
  };

  return (
    <div className="container">
      <h1>Blog Post</h1>
      <p>Welcome, {user.email}!</p>
      <Button variant="primary" onClick={handleExtractData}>
        Extract Data
      </Button>
      <pre>
        <code>
          {JSON.stringify(data, null, 2)}
        </code>
      </pre>
    </div>
  );
};

export default BlogPost;
