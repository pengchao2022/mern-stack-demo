import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isValidId, setIsValidId] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const hasProcessed = useRef(false);
  const redirectTimeout = useRef(null);

  const checkIdValidity = () => {
    const isValidObjectId = (str) => {
      return str && 
             typeof str === 'string' && 
             str.length === 24 && 
             /^[0-9a-fA-F]{24}$/.test(str) &&
             str !== 'undefined' && 
             str !== 'null';
    };
    
    let actualId = id;
    
    if (isValidObjectId(actualId)) {
      return { valid: true, id: actualId };
    }
    
    const path = window.location.pathname;
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];
    
    if (isValidObjectId(lastSegment)) {
      return { valid: true, id: lastSegment };
    }
    
    if (path === '/note/undefined' || lastSegment === 'undefined') {
      return { valid: false, id: null };
    }
    
    return { valid: false, id: null };
  };

  const fetchNote = async (validId) => {
    try {
      const response = await fetch(`/api/notes/${validId}`);
      
      if (!response.ok) {
        throw new Error('笔记不存在或加载失败');
      }
      
      const data = await response.json();
      setNote(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }
    
    hasProcessed.current = true;
    
    const { valid, id: validId } = checkIdValidity();
    
    if (!valid) {
      setIsValidId(false);
      setLoading(false);
      setError('无效的笔记ID，正在返回首页...');
      
      redirectTimeout.current = setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
      
      return;
    }
    
    fetchNote(validId);

    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm(`确定要删除笔记"${note?.title || '无标题'}"吗？此操作不可撤销。`)) {
      return;
    }

    setDeleteLoading(true);
    
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('删除失败');
      }
      
      alert('笔记删除成功！');
      navigate('/'); // 删除成功后返回首页
    } catch (err) {
      alert(`删除失败: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  if (!isValidId) {
    return (
      <div style={styles.container}>
        <div style={styles.redirecting}>
          <h2>正在重定向...</h2>
          <p>检测到无效的笔记ID</p>
          <p>正在返回首页...</p>
          <div style={styles.spinner}></div>
          <button 
            onClick={() => navigate('/')}
            style={styles.button}
          >
            立即返回首页
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <h2>加载中...</h2>
          <p>正在获取笔记详情</p>
          <div style={styles.spinner}></div>
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
          <button 
            onClick={() => window.location.reload()}
            style={styles.secondaryButton}
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>数据错误</h2>
          <p>无法加载笔记数据</p>
          <button onClick={() => navigate('/')}>返回首页</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← 返回列表
        </button>
        <h1 style={styles.title}>{note.title}</h1>
        
        {/* 操作按钮 */}
        <div style={styles.actionButtons}>
          <button 
            onClick={handleEdit}
            style={styles.editButton}
            disabled={deleteLoading}
          >
            编辑
          </button>
          <button 
            onClick={handleDelete}
            style={styles.deleteButton}
            disabled={deleteLoading}
          >
            {deleteLoading ? '删除中...' : '删除'}
          </button>
        </div>
      </header>
      
      <div style={styles.contentBox}>
        <div style={styles.meta}>
          <span>创建: {new Date(note.createdAt).toLocaleString()}</span>
          <span>更新: {new Date(note.updatedAt).toLocaleString()}</span>
        </div>
        
        <div style={styles.content}>
          {note.content.split('\n').map((line, index) => (
            <p key={index} style={styles.paragraph}>
              {line || <br />}
            </p>
          ))}
        </div>
      </div>
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
  redirecting: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: '#fff3cd',
    borderRadius: '10px',
    marginTop: '100px',
    border: '1px solid #ffeaa7',
  },
  header: {
    marginBottom: '30px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  backButton: {
    background: '#f0f0f0',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    alignSelf: 'flex-start',
    transition: 'background 0.3s',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0',
    color: '#333',
    wordBreak: 'break-word',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  editButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    flex: 1,
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    flex: 1,
  },
  contentBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
    flexWrap: 'wrap',
    gap: '10px',
  },
  content: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#444',
    whiteSpace: 'pre-wrap',
  },
  paragraph: {
    margin: '0 0 1em 0',
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
    border: '1px solid #f5c6cb',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    marginRight: '10px',
  },
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  spinner: {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    margin: '20px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default NoteDetailPage;