import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
// BarChart2
import { ArrowLeft, ArrowDown, ArrowUp, Download,  } from 'react-bootstrap-icons';

const StoreTransaction = () => {
  return (
    <div className="container-fluid bg-light d-flex flex-column vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 bg-white">
        <div className="d-flex align-items-center">
          <ArrowLeft className="me-3" size={20} />
          <h5 className="mb-0">Transactions</h5>
        </div>
        <Download className="text-success" size={20} />
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 p-3">
        <Dropdown className="flex-grow-1">
          <Dropdown.Toggle variant="light" className="w-100 text-start bg-white">
            All Categories
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>All Categories</Dropdown.Item>
            <Dropdown.Item>Transfers</Dropdown.Item>
            <Dropdown.Item>Interest</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="flex-grow-1">
          <Dropdown.Toggle variant="light" className="w-100 text-start bg-white">
            All Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>All Status</Dropdown.Item>
            <Dropdown.Item>Successful</Dropdown.Item>
            <Dropdown.Item>Failed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Transaction Period */}
      <div className="p-3 bg-white">
        <h6>Jan 2025</h6>
        <div className="text-muted small">
          <span>In: ₦23,722.75</span>
          <span className="ms-3">Out: ₦29,416.00</span>
        </div>
      </div>

      {/* Transactions List - Now Scrollable */}
      <div className="flex-grow-1 overflow-auto bg-white mt-2">
        <div className="d-flex align-items-center p-3 border-bottom">
          <div className="rounded-circle p-2 me-3 bg-light-purple">
            <span className="text-purple">%</span>
          </div>
          <div className="flex-grow-1">
            <div className="text-truncate">OWealth Interest</div>
            <small className="text-muted">Jan 23rd, 03:14:12</small>
          </div>
          <div className="text-end text-success">
            +₦0.09
            <div className="small text-success">Successful</div>
          </div>
        </div>

        <div className="d-flex align-items-center p-3 border-bottom">
          <div className="rounded-circle p-2 me-3 bg-light-green">
            <ArrowUp className="text-success" />
          </div>
          <div className="flex-grow-1">
            <div className="text-truncate">Transfer to KABIRU AYINDE ADEGBOYE</div>
            <small className="text-muted">Jan 22nd, 12:02:52</small>
          </div>
          <div className="text-end">
            -₦5,000.00
            <div className="small text-success">Successful</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Nav className="bg-white border-top">
        <div className="d-flex w-100 justify-content-around p-2">
          <div className="text-center text-success">
            <ArrowDown size={24} />
            <div className="small">Transactions</div>
          </div>
          <div className="text-center text-muted">
            {/* <BarChart2 size={24} /> */}
            <div className="small">Statistics</div>
          </div>
        </div>
      </Nav>
    </div>
  );
};

export default StoreTransaction;