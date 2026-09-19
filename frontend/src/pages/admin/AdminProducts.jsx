import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  function load() {
    client.get('/api/admin/products').then((res) => setProducts(res.data.content));
  }

  useEffect(load, []);

  async function deactivate(id) {
    if (!confirm('Deactivate this product? It will stop showing on the storefront.')) return;
    await client.delete(`/api/admin/products/${id}`);
    load();
  }

  return (
    <div>
      <h1>Products</h1>
      <Link to="/admin/products/new" className="btn btn-primary">Add Product</Link>
      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th><th>Active</th><th></th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>Rs.{p.price}</td>
              <td>{p.stockQty}</td>
              <td>{p.active ? 'Yes' : 'No'}</td>
              <td>
                <Link to={`/admin/products/${p.id}/edit`}>Edit</Link>
                {' | '}
                <button className="link-button" onClick={() => deactivate(p.id)}>Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
