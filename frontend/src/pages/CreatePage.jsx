import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('创建笔记失败');
      }

      const data = await response.json();
      navigate(`/note/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📝 创建新笔记</h1>
        <button 
          onClick={() => navigate('/')}
          style={styles.backButton}
        >
          ← 返回
        </button>
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>标题</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="输入笔记标题"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="content" style={styles.label}>内容</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            placeholder="输入笔记内容..."
            rows="10"
            required
          />
        </div>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={styles.cancelButton}
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? '创建中...' : '创建笔记'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eaeaea',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    margin: 0,
  },
  backButton: {
    background: 'none',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelButton: {
    padding: '12px 24px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  submitButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '5px',
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

export default CreatePage;
