import React from 'react';
import PriorityNewsSidebar from './PriorityNews';

function Sidebar() {
  return (
    <>
      {/* Search Widget */}
      <div className="card mb-4">
        <div className="card-header">Search</div>
        <div className="card-body">
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Enter search term..." />
            <button className="btn btn-primary" type="button">Go!</button>
          </div>
        </div>
      </div>

      {/* Categories Widget */}
      <div className="card mb-4">
        <div className="card-header">Categories</div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6">
              <ul className="list-unstyled mb-0">
                <li><a href="#!">Web Design</a></li>
                <li><a href="#!">HTML</a></li>
                <li><a href="#!">Freebies</a></li>
              </ul>
            </div>
            <div className="col-sm-6">
              <ul className="list-unstyled mb-0">
                <li><a href="#!">JavaScript</a></li>
                <li><a href="#!">CSS</a></li>
                <li><a href="#!">Tutorials</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Priority News Widget 추가 */}
      <PriorityNewsSidebar />

      {/* Side Widget */}
      <div className="card mb-4">
        <div className="card-header">Side Widget</div>
        <div className="card-body">
          You can put anything you want inside of these side widgets.
        </div>
      </div>
    </>
  );
}

export default Sidebar;