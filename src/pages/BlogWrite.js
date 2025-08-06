import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { FaFileUpload, FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

function Write() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();  // 여기 선언

  useEffect(() => {
    const now = new Date().toISOString().slice(0, 10);
    setCreatedAt(now);
    setUpdatedAt(now);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    setUpdatedAt(now);
    alert(
      `글쓰기\n제목: ${title}\n작성자: ${author}\n작성일: ${createdAt}\n수정일: ${updatedAt}\n내용: ${content}\n첨부파일: ${file ? file.name : '없음'}`
    );
    navigate('/blogList');  // 글쓰기 후 목록 페이지로 이동
  };

  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4 text-center text-primary">
        <FaPen style={{ marginRight: '8px' }} />
        글쓰기
      </h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
        {/* 제목 */}
        <div className="mb-4 position-relative">
          <label htmlFor="title" className="form-label fw-bold">
            제목
          </label>
          <input
            id="title"
            type="text"
            className="form-control ps-5"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <FaPen
            style={{
              position: 'absolute',
              left: '15px',
              top: '38px',
              color: '#0d6efd',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* 내용 */}
        <div className="mb-4">
          <label className="form-label fw-bold">내용</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="내용을 입력하세요"
            style={{ height: '350px', marginBottom: '50px' }}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'code-block'],
                ['clean'],
              ],
            }}
          />
        </div>

        {/* 파일 첨부 */}
        <div className="mb-4 position-relative">
          <label htmlFor="file" className="form-label fw-bold">
            파일 첨부
          </label>
          <input
            id="file"
            type="file"
            className="form-control ps-5"
            onChange={handleFileChange}
          />
          <FaFileUpload
            style={{
              position: 'absolute',
              left: '15px',
              top: '38px',
              color: '#0d6efd',
              pointerEvents: 'none',
            }}
          />
          {file && <small className="text-muted">첨부파일: {file.name}</small>}
        </div>

        {/* 버튼 */}
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary px-4"
            style={{ fontWeight: '600', fontSize: '1.1rem' }}
          >
            글쓰기
          </button>
        </div>
      </form>
    </div>
  );
}

export default Write;
