import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${id}`);
        
        if (!response.ok) {
          throw new Error('笔记不存在');
        }
        
        const data = await response.json();
        setTitle(data.title || '');
        setContent(data.content || '');
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    setSaving(true);
    
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('更新失败');
      }
      
      alert('笔记更新成功！');
      navigate(`/note/${id}`);
    } catch (err) {
      alert(`更新失败: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <h2>加载中...</h2>
          <p>正在获取笔记数据</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>错误</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')}
            style={styles.button}
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← 返回
        </button>
        <h1 style={styles.title}>编辑笔记</h1>
      </header>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.titleInput}
            placeholder="请输入标题"
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.contentInput}
            placeholder="请输入内容"
            rows={15}
          />
        </div>
        
        <div style={styles.buttonGroup}>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            style={styles.cancelButton}
            disabled={saving}
          >
            取消
          </button>
          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={saving}
          >
            {saving ? '保存中...' : '保存'}
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
    minHeight: '100vh',
  },
  header: {
    marginBottom: '30px',
  },
  backButton: {
    background: '#f0f0f0',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    margin: '0',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  titleInput: {
    width: '100%',
    padding: '12px',
    fontSize: '1.2rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  contentInput: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    marginTop: '100px',
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    color: '#721c24',
    backgroundColor: '#f8d7da',
    borderRadius: '10px',
    marginTop: '100px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default EditPage;