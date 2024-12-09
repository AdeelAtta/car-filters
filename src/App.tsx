import React, { useState, useEffect } from 'react';
import { Sliders, ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-react';


const makes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Hyundai'];
const models = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
  Ford: ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', '7 Series'],
  Mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class'],
  Audi: ['A3', 'A4', 'Q5', 'Q7', 'A6'],
  Volkswagen: ['Golf', 'Passat', 'Tiguan', 'Atlas', 'Jetta'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona']
};
const sorting = {
  "price:1": "Price: Low to High",
  "price:-1": "Price: High to Low",
  "year:1": "Year: Oldest to Newest",
  "year:-1": "Year: Newest to Oldest",
  "mileage:1": "Miles Covered: Low to High",
  "mileage:-1": "Miles Covered: High to Low"
}
const ITEMS_PER_PAGE = 12;

export default function App() {

  const [filters, setFilters] = useState({
    search: ``,
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: ITEMS_PER_PAGE,
    sort: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [pagination, setPagination] = useState({ current: 1, total: 0, totalRecords: 0 })

  const validatePrice = (value) => {
    const price = parseInt(value);
    if (isNaN(price) || price < 0) return '';
    return price;
  };

  const handleSort = (option) => {
    setSortOption(option);

    switch (option) {
      case 'price:1':
        handleFilterChange({ sort: "price:1" })
        // sortedCars.sort((a, b) => a.price - b.price);
        break;
      case 'price:-1':
        handleFilterChange({ sort: "price:-1" })
        // sortedCars.sort((a, b) => b.price - a.price);
        break;
      case 'year:1':
        handleFilterChange({ sort: "year:1" })
        // sortedCars.sort((a, b) => a.year - b.year);
        break;
      case 'year:-1':
        handleFilterChange({ sort: "year:-1" })
        // sortedCars.sort((a, b) => b.year - a.year);
        break;
      case 'mileage:1':
        handleFilterChange({ sort: "mileage:1" })
        // sortedCars.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'mileage:-1':
        handleFilterChange({ sort: "mileage:-1" })
        // sortedCars.sort((a, b) => b.mileage - a.mileage);
        break;
      default:
        break;
    }

  };

  const handleFilterChange = (obj) => {
    setFilters({ ...filters, ...obj, page: 1 })



  }


  const handlePageChange = (pageNumber) => {
    setFilters({ ...filters, page: pageNumber })
    // setCurrentPage(pageNumber);
    window.scrollTo({
      top: 10,
      behavior: 'smooth'
    });
  };



  const searchCars = async () => {
    setLoading(true);
    // setSortOption(''); // Reset sort option on new search
    try {
      let cleanFiler: any = Object.fromEntries(Object.entries(filters).filter(([__, value]) => value !== ''))
      const queryParams = new URLSearchParams(cleanFiler);
      const response = await fetch(`http://localhost:3500/api/v1/cars/search?${queryParams}`);
      const data = await response.json();
      setCars(data.data);
      setPagination(data.pagination)
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchCars();

    }, 200)
    return () => clearTimeout(timeout)
  }, [filters]);



  const Pagination = () => {
    const renderPageButtons = () => {
      const currentPage = filters.page;
      const totalPages = pagination.total;

      // Show at most 3 pages
      let pagesToShow = [currentPage]; // Always show current page

      // Try to add one page before and after
      if (currentPage > 1) pagesToShow.unshift(currentPage - 1);
      if (currentPage < totalPages) pagesToShow.push(currentPage + 1);

      return pagesToShow.map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 border rounded-lg ${currentPage === page
            ? 'bg-blue-600 text-white'
            : 'hover:bg-gray-50'
            }`}
        >
          {page}
        </button>
      ));
    };

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(filters.page - 1)}
          disabled={filters.page === 1}
          className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={20} />
        </button>

        {renderPageButtons()}

        <button
          onClick={() => handlePageChange(filters.page + 1)}
          disabled={filters.page === pagination.total}
          className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Car</h1>
        <p className="mt-2 text-gray-600">Search through thousands of cars</p>
      </div>


      <div className="py-4">
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
              {filters.make ? (models[filters.make].map((model) => (
                <button
                  key={model}
                  onClick={() => handleFilterChange({ model: filters.model === model ? '' : model })}
                  className={`px-4 py-2 rounded-full border transition-colors ${filters.model === model
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {model}
                </button>
              )))
                :
                (Object.keys(models).map(make => {
                  return models[make].map((model) => (
                    <button
                      key={model}
                      onClick={() => handleFilterChange({ model: filters.model === model ? '' : model })}
                      className={`px-4 py-2 rounded-full border transition-colors ${filters.model === model
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {model}
                    </button>
                  ))
                }))
              }
            </div>
          </div>
          {/* Optional: Add scroll indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>


      {/* Search Form */}
      <form onSubmit={(e) => { e.preventDefault(); }} className="mb-8">
        <div className="flex flex-col space-y-4">
          {/* Main Search Bar with Make Dropdown */}
          <div className="flex gap-4">
            <div className="flex-2">
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                value={filters.make}
                onChange={(e) => handleFilterChange({ make: e.target.value, model: '' })}
              >
                <option value="">Select Company</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 items-center justify-center ">
              <div className="w-full ">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input type="text" onChange={(e) => handleFilterChange({ search: e.target.value })} className="block w-full px-10 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search" />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Sliders size={20} />
              Filters
              {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Year Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1900"  // First Mercedes-Benz car
                    max={new Date().getFullYear() + 1} // Allow next year's models
                    className="w-full px-3 py-2 border rounded"
                    value={filters.minYear}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value && value >= 1886) {
                        handleFilterChange({
                          ...filters,
                          minYear: Math.min(value, new Date().getFullYear() + 1)
                        });
                      } else {
                        handleFilterChange({
                          ...filters,
                          minYear: ''
                        });
                      }
                    }}
                    placeholder="Min Year"
                    onKeyPress={(e) => {
                      if (e.key === '-') e.preventDefault();
                    }}
                  />
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border rounded"
                    value={filters.maxYear}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value && value >= 1886) {
                        handleFilterChange({
                          ...filters,
                          maxYear: Math.min(value, new Date().getFullYear() + 1)
                        });
                      } else {
                        handleFilterChange({
                          ...filters,
                          maxYear: ''
                        });
                      }
                    }}
                    placeholder="Max Year"
                    onKeyPress={(e) => {
                      if (e.key === '-') e.preventDefault();
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Min Price"
                    className="w-full px-3 py-2 border rounded"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange({
                      minPrice: validatePrice(e.target.value)
                    })}
                    pattern="\d*"
                  />
                  <input
                    type="text"
                    placeholder="Max Price"
                    className="w-full px-3 py-2 border rounded"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange({
                      maxPrice: validatePrice(e.target.value)
                    })}
                    pattern="\d*"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setFilters({
                    search: ``,
                    make: '',
                    model: '',
                    minYear: '',
                    maxYear: '',
                    minPrice: '',
                    maxPrice: '',
                    page: 1,
                    limit: ITEMS_PER_PAGE
                  })}
                  className="w-full px-4 py-2 text-gray-600 bg-white border rounded hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Results Section */}
      <div className="results-section">
        {/* Sort Dropdown */}
        {cars.length > 0 && (
          <div className="flex justify-end mb-4">
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              value={sorting[sortOption]}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value={sortOption}>{sortOption.length > 0 ? sorting[sortOption] : `Sort By`}</option>
              {Object.keys(sorting).map((key) => {
                if (key !== sortOption) {
                  return <option key={key} value={key}>{sorting[key]}</option>
                }
              })}
            </select>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : cars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cars.map((car) => (
                <div key={car._id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Car Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-2xl font-bold text-blue-600">
                        ${car.price.toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        {car.mileage.toLocaleString()} miles
                      </p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {car.transmission}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {car.fuelType}
                        </span>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > 0 && <Pagination />}
          </>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No cars found. Try adjusting your search filters.
          </div>
        )}
      </div>
    </div>
  );
}