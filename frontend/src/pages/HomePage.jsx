import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      
      if (!response.ok) {
        throw new Error('获取数据失败');
      }
      
      const data = await response.json();
      
      // 过滤掉无效的笔记
      const validNotes = data.filter(note => {
        if (!note || typeof note !== 'object') {
          return false;
        }
        
        const hasValidId = note._id && 
                          typeof note._id === 'string' && 
                          note._id.trim() !== '' && 
                          note._id !== 'undefined' && 
                          note._id !== 'null' &&
                          note._id.length >= 10;
        
        return hasValidId;
      });
      
      setNotes(validNotes);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (noteId, noteTitle) => {
    if (!window.confirm(`确定要删除笔记"${noteTitle || '无标题'}"吗？此操作不可撤销。`)) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [noteId]: true }));
    
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('删除失败');
      }
      
      // 从列表中移除已删除的笔记
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      alert('笔记删除成功！');
    } catch (err) {
      alert(`删除失败: ${err.message}`);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [noteId]: false }));
    }
  };

  const handleEdit = (noteId) => {
    navigate(`/edit/${noteId}`);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <h2>加载中...</h2>
          <p>正在获取笔记列表</p>
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
          <button onClick={() => window.location.reload()}>重试</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📒 我的笔记</h1>
        <Link to="/create" style={styles.createButton}>
          + 新建笔记
        </Link>
      </header>

      {notes.length === 0 ? (
        <div style={styles.empty}>
          <p>还没有笔记，创建一个吧！</p>
          <Link to="/create" style={styles.createButton}>
            创建第一个笔记
          </Link>
        </div>
      ) : (
        <div>
          <h2 style={styles.sectionTitle}>📝 笔记列表 ({notes.length})</h2>
          <div style={styles.notesGrid}>
            {notes.map((note) => (
              <div key={note._id} style={styles.noteCardWrapper}>
                <Link 
                  to={`/note/${note._id}`}
                  style={styles.noteCard}
                >
                  <div style={styles.noteHeader}>
                    <h3 style={styles.noteTitle}>
                      {note.title || '无标题'}
                    </h3>
                  </div>
                  <p style={styles.noteContent}>
                    {note.content && note.content.length > 100 
                      ? `${note.content.substring(0, 100)}...` 
                      : note.content || '无内容'}
                  </p>
                  <div style={styles.noteMeta}>
                    <span style={styles.date}>
                      创建: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '未知'}
                    </span>
                  </div>
                </Link>
                
                {/* 操作按钮 */}
                <div style={styles.actionButtons}>
                  <button 
                    onClick={() => handleEdit(note._id)}
                    style={styles.editButton}
                    disabled={deleteLoading[note._id]}
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => handleDelete(note._id, note.title)}
                    style={styles.deleteButton}
                    disabled={deleteLoading[note._id]}
                  >
                    {deleteLoading[note._id] ? '删除中...' : '删除'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
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
    fontSize: '2.5rem',
    color: '#333',
    margin: 0,
  },
  createButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#555',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    marginTop: '20px',
  },
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
    marginTop: '20px',
  },
  noteCardWrapper: {
    position: 'relative',
    transition: 'transform 0.2s',
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'block',
    border: '1px solid #eaeaea',
    height: '100%',
  },
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  noteTitle: {
    fontSize: '1.3rem',
    marginTop: 0,
    marginBottom: 0,
    color: '#333',
    flex: 1,
  },
  noteContent: {
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.5',
    minHeight: '60px',
  },
  noteMeta: {
    fontSize: '0.8rem',
    color: '#888',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
  date: {
    fontStyle: 'italic',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
  },
  editButton: {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
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
};

export default HomePage;