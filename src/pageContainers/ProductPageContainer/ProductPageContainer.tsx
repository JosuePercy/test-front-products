import axios from "axios";
import "./ProductPageContainerStyled.css";
import {useEffect, useState } from "react";
import { ProductType } from "./ProductoPageContainer.types";

const URL_BASE = "http://localhost:3000";

const ProductoPageContainer = () => {

  const [products, setProducts] = useState<ProductType[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)



  const getAllProducts = async () => {
    await axios
      .get<[]>(`${URL_BASE}/api/product`)
      .then(
        (resp) => setProducts(resp.data) 
      )
      .catch((err) => console.log("ERROR: ", err));
  };

  useEffect(() => {
    getAllProducts()
  }, [])


  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    const product = products.find((p) => p.id === selectedId) || null;
    setSelectedProduct(product);
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedProduct) {
      try {
        await axios.put(`${URL_BASE}/api/product/${selectedProduct.id}`, {
          name: selectedProduct.name,
          description: selectedProduct.description,
          price: selectedProduct.price,
        });
        alert("Producto actualizado con éxito");
        getAllProducts(); 
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        alert("Hubo un error al actualizar el producto.");
      }
    }
  };


  return (
    <form>
      <h1>Producto</h1>
      <div>
        <label>Producto:</label>
        <select id="producto" onChange={handleProductChange}>
          <option value="">Seleccione un producto</option>
          {
            products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))
          }
        </select>
      </div>
      <div>
        <label>Nombre:</label>
        <input 
          type="text" 
          value={selectedProduct?.name || ""}
          onChange={(e) =>
            setSelectedProduct((prev) => (prev ? { ...prev, name: e.target.value } : null))
          }
          required 
        />
      </div>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={selectedProduct?.description || ""}
          onChange={(e) =>
            setSelectedProduct((prev) =>
              prev ? { ...prev, description: e.target.value } : null
            )
          }
          required
        />
      </div>

      <div>
        <label>Precio:</label>
        <input
          type="number"
          value={selectedProduct?.price || ""}
          onChange={(e) =>
            setSelectedProduct((prev) => (prev ? { ...prev, price: Number(e.target.value) } : null))
          }
          required
        />
      </div>

      <button type="submit" onClick={handleSubmit}>Guardar</button>
    </form>
  );
};

export default ProductoPageContainer;
