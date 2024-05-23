import React, { useState, useEffect } from 'react';
import './Main.css';

const Main = () => {
  const [storyList, setStoryList] = useState([]);
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [descLength, setDescLength] = useState(100);
  const maxLength = 100;
  const warnLength = 10;

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('storyList')) || [];
    setStoryList(list);
  }, []);

  const updateStore = (list) => {
    localStorage.setItem('storyList', JSON.stringify(list));
  };

  const updateList = (newStory = null, updatedList = null) => {
    let updatedStoryList = [...storyList];
    if (newStory) updatedStoryList = [...updatedStoryList, newStory];
    if (updatedList) updatedStoryList = updatedList;

    setStoryList(updatedStoryList);
    updateStore(updatedStoryList);
  };

  const formValidate = (e) => {
    e.preventDefault();
    if (description === '' || description.length < 60) {
      alert('Description should be at least 60 characters');
      return;
    }
    if (assignedTo === '') {
      alert('Please select assigned to');
      return;
    }
    if (priority === '') {
      alert('Please select priority');
      return;
    }
    if (fromDate === '' || toDate === '') {
      alert('Please select both From Date and To Date');
      return;
    }

    const newStory = {
      id: 'id' + Math.random().toString(16).slice(2),
      description,
      assignedTo,
      priority,
      fromDate,
      toDate,
      storyStatus: 'open',
    };

    setDescription('');
    setAssignedTo('');
    setPriority('');
    setFromDate('');
    setToDate('');
    setDescLength(maxLength);

    updateList(newStory);
  };

  const closeStory = (storyId) => {
    const updatedList = storyList.map((story) =>
      story.id === storyId ? { ...story, storyStatus: 'closed' } : story
    );
    updateList(null, updatedList);
  };

  const deleteStory = (storyId) => {
    const updatedList = storyList.filter((story) => story.id !== storyId);
    updateList(null, updatedList);
  };

  const textCounter = (e) => {
    const count = e.target.value.length;
    setDescLength(maxLength - count);
    if (count > maxLength) {
      setDescription(description.substring(0, maxLength));
    } else {
      setDescription(e.target.value);
    }
  };

  return (
    <main role="main" className="container pt-5 pb-5">
      <section>
        <h2 className="display-6 pb-2">Create Agile Story</h2>
        <form onSubmit={formValidate}>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Task Description</label>
            <textarea
              className="form-control"
              cols="80"
              rows="3"
              placeholder="Enter task description"
              id="description"
              value={description}
              onChange={textCounter}
            ></textarea>
            <br />
            <div id="descLength" className={`form-text ${descLength <= warnLength ? 'text-danger' : ''}`}>
              {descLength} characters left
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="fromDate" className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <br />
            <div className="col-md-6 mb-3">
              <label htmlFor="toDate" className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <br />
          <div className="mb-3">
            <label htmlFor="assignedto" className="form-label">Assigned To</label>
            <select
              className="form-select"
              id="assignedto"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="" disabled>Select assigned to</option>
              <option value="Edwin">Edwin</option>
              <option value="Tom">Tom</option>
              <option value="Carl">Carl</option>
              <option value="Jerome">Jerome</option>
              <option value="Carmelo">Carmelo</option>
            </select>
          </div>
          <br />
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              className="form-select"
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="" disabled>Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <br />
          <button type="submit" className="btn btn-primary" id="storySubmitBtn">
            Create Agile Story
          </button>
        </form>
        <br />
        <br />
      </section>
      <section className="pt-5">
        <div id="storyCardList" className="row g-2">
          {storyList.length > 0 ? (
            storyList.map((story) => (
              <div id={story.id} key={story.id} className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between align-items-center">
                      {story.storyStatus === 'open' ? 'Open' : 'Closed'}
                      <div>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => closeStory(story.id)}
                        >
                          Close
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteStory(story.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </h5>
                    <p className="card-text"><strong>Description:</strong> {story.description}</p>
                    <p className="card-text"><strong>Assigned to:</strong> {story.assignedTo}</p>
                    <p className="card-text"><strong>Priority:</strong> {story.priority}</p>
                    <p className="card-text"><strong>From Date:</strong> {story.fromDate}</p>
                    <p className="card-text"><strong>To Date:</strong> {story.toDate}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="alert alert-warning">No stories available. Please add some stories.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Main;
