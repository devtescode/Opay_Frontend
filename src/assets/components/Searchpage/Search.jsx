import React from 'react'
import { ChevronLeft,  } from 'lucide-react';

const Search = () => {
    return (
        <div>
            <div className="container-sm bg-white min-vh-100 p-3" style={{ maxWidth: '500px' }}>
                {/* Header */}
                <div className="d-flex align-items-center mb-4">
                    <button className="btn btn-link p-0 me-2 text-dark border-0">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="fs-3 fw-medium text-dark mb-0">Search Beneficiaries</h1>
                </div>

                {/* Search Input */}
                <div className="position-relative">
                    <div className="position-absolute top-0 bottom-0 start-3 d-flex align-items-center pointer-events-none">
                        <i class="ri-search-line text-secondary mx-3"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Account number or name"
                        className="form-control ps-5 py-2 border-1 rounded-3"
                        autoFocus
                        style={{ borderColor: '#e2e8f0' }}
                    />
                    <div className="position-absolute top-0 bottom-0 start-10 d-flex align-items-center pointer-events-none">
                        <div className="h-75 w-1 bg-info" style={{ animation: 'pulse 1.5s infinite' }}></div>
                    </div>
                </div>

                {/* Empty state / Results would appear here */}
                <div className="mt-3">
                    {/* Search results would be rendered here */}
                </div>
            </div>
        </div>
    )
}

export default Search