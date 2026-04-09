import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globales
import { ToastContainer } from 'react-toastify';
import SidebarLayout from 'layouts/SidebarLayout';

// UIS AUTH & ERRORS
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'pages/auth/Login/Login';

// UI HOME
import Home from 'pages/home/Home';

// UI DASHBOARD
import Dashboard from 'pages/dashboard/Dashboard';

//UI EMPLEADOS
import AgregarEmpleado from 'pages/empleado/Store';
import EditarEmpleado from 'pages/empleado/Update';
import ListarEmpleados from 'pages/empleado/Index';

//UI CLientes
import AgregarCliente from 'pages/cliente/Store';
import EditarCliente from 'pages/cliente/Update';
import ListarClientes from 'pages/cliente/Index';

// UI UNIDADES DE MEDIDA
import AgregarUnidad from 'pages/unidadMedida/Store';
import EditarUnidad from 'pages/unidadMedida/Update';
import ListarUnidades from 'pages/unidadMedida/Index';

// UI PROVEEDORES
import AgregarProveedor from 'pages/proveedor/Store';
import EditarProveedor from 'pages/proveedor/Update';
import ListarProveedores from 'pages/proveedor/Index';

// UI INSUMOS
import AgregarInsumo from 'pages/insumo/Store';
import EditarInsumo from 'pages/insumo/Update';
import ListarInsumos from 'pages/insumo/Index';

// UI ALMACENES
import AgregarAlmacen from 'pages/almacen/Store';
import EditarAlmacen from 'pages/almacen/Update';
import ListarAlmacenes from 'pages/almacen/Index';
import StockAlmacen from 'pages/almacenStock/Index';

// UI COMPRAS
import ListarCompras from 'pages/compra/Index';
import RegistrarCompra from 'pages/compra/Store';

// UI KARDEX
import KardexIndex from 'pages/kardex/Index';

// UI TRASPASOS
import ListarTraspasos from 'pages/traspaso/Index';
import RegistrarTraspaso from 'pages/traspaso/Store';

// UI SALIDAS
import ListarSalidas from 'pages/salida/Index';
import RegistrarSalida from 'pages/salida/Store';

// UI CATEGORÍAS DE PLATOS
import AgregarCategoriaPlato from 'pages/categoriaPlato/Store';
import EditarCategoriaPlato from 'pages/categoriaPlato/Update';
import ListarCategoriasPlatos from 'pages/categoriaPlato/Index';

// UI PLATOS
import AgregarPlato from 'pages/plato/Store';
import EditarPlato from 'pages/plato/Update';
import ListarPlatos from 'pages/plato/Index';

//UI ADICIONALES
import AgregarAdicional from 'pages/adicional/Store';
import EditarAdicional from 'pages/adicional/Update';
import ListarAdicionales from 'pages/adicional/Index';

//UI MENUS
import AgregarMenu from 'pages/menu/Store';
import EditarMenu from 'pages/menu/Update';
import ListarMenus from 'pages/menu/Index';

//UI OPCIONES MENU
import AgregarOpcion from 'pages/menuOpcion/Store';
import EditarOpcion from 'pages/menuOpcion/Update';
import ListarOpciones from 'pages/menuOpcion/Index';

//UI MESAS
import AgregarMesa from 'pages/mesa/Store';
import EditarMesa from 'pages/mesa/Update';
import ListarMesas from 'pages/mesa/Index';

//UI ORDEN
//Salon
import MesasMap from 'pages/orden/salon/MesasMap';
import IndexSalon from 'pages/orden/salon/Index';
import StoreSalon from 'pages/orden/salon/Store';
import UpdateSalon from 'pages/orden/salon/Update';
//Llevar
import IndexLlevar from 'pages/orden/llevar/Index';
import StoreLlevar from 'pages/orden/llevar/Store';

//UI VENTAS
import VentaIndex from 'pages/venta/Index';
import VentaStore from 'pages/venta/Store';

//UI CAJAS
import AgregarCaja from 'pages/caja/Store';
import EditarCaja from 'pages/caja/Update';
import ListarCajas from 'pages/caja/Index';
import ListarCajaSesiones from 'pages/cajaSesion/Index';

// SETTINGS
import ListarRoles from 'pages/rol/Index';

// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';
import { AuthProvider } from 'context/AuthContext';


function AppContent() {
  return (
    <Routes>
      {/* 1. LOGIN */}
      <Route path="/" element={<ProtectedRouteHome element={<Login />} />} />

      {/* 2. LAYOUT GLOBAL */}
      <Route element={<ProtectedRoute element={<SidebarLayout />} />}>

        {/* HOME */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        
        {/* DASHBOARD */}
        <Route path="/dashboard" element={<ProtectedRoute requiredPermission="dashboard.index" element={<Dashboard />} />} />

        {/* CLIENTES */}
        <Route path="/cliente/agregar" element={<ProtectedRoute requiredPermission="cliente.store" element={<AgregarCliente />} />} />
        <Route path="/cliente/editar/:id" element={<ProtectedRoute requiredPermission="cliente.update" element={<EditarCliente />} />} />
        <Route path="/cliente/listar" element={<ProtectedRoute requiredPermission="cliente.index" element={<ListarClientes />} />} />

        {/* EMPLEADOS */}
        <Route path="/empleado/agregar" element={<ProtectedRoute requiredPermission="empleado.store" element={<AgregarEmpleado />} />} />
        <Route path="/empleado/editar/:id" element={<ProtectedRoute requiredPermission="empleado.update" element={<EditarEmpleado />} />} />
        <Route path="/empleado/listar" element={<ProtectedRoute requiredPermission="empleado.index" element={<ListarEmpleados />} />} />

        {/* UNIDADES DE MEDIDA */}
        <Route path="/unidad-medida/agregar" element={<ProtectedRoute requiredPermission="unidadMedida.store" element={<AgregarUnidad />} />} />
        <Route path="/unidad-medida/editar/:id" element={<ProtectedRoute requiredPermission="unidadMedida.update" element={<EditarUnidad />} />} />
        <Route path="/unidad-medida/listar" element={<ProtectedRoute requiredPermission="unidadMedida.index" element={<ListarUnidades />} />} />

        {/* PROVEEDORES */}
        <Route path="/proveedor/agregar" element={<ProtectedRoute requiredPermission="proveedor.store" element={<AgregarProveedor />} />} />
        <Route path="/proveedor/editar/:id" element={<ProtectedRoute requiredPermission="proveedor.update" element={<EditarProveedor />} />} />
        <Route path="/proveedor/listar" element={<ProtectedRoute requiredPermission="proveedor.index" element={<ListarProveedores />} />} />

        {/* INSUMOS */}
        <Route path="/insumo/agregar" element={<ProtectedRoute requiredPermission="insumo.store" element={<AgregarInsumo />} />} />
        <Route path="/insumo/editar/:id" element={<ProtectedRoute requiredPermission="insumo.update" element={<EditarInsumo />} />} />
        <Route path="/insumo/listar" element={<ProtectedRoute requiredPermission="insumo.index" element={<ListarInsumos />} />} />

        {/* ALMACENES */}
        <Route path="/almacen/agregar" element={<ProtectedRoute requiredPermission="almacen.store" element={<AgregarAlmacen />} />} />
        <Route path="/almacen/editar/:id" element={<ProtectedRoute requiredPermission="almacen.update" element={<EditarAlmacen />} />} />
        <Route path="/almacen/listar" element={<ProtectedRoute requiredPermission="almacen.index" element={<ListarAlmacenes />} />} />
        <Route path="/almacen/stock" element={<ProtectedRoute requiredPermission="almacenStock.index" element={<StockAlmacen />} />} />

        {/* COMPRAS */}
        <Route path="/compra/listar" element={<ProtectedRoute requiredPermission="compra.index" element={<ListarCompras />} />} />
        <Route path="/compra/agregar" element={<ProtectedRoute requiredPermission="compra.store" element={<RegistrarCompra />} />} />

        {/* KARDEX */}
        <Route path="/kardex/listar" element={<ProtectedRoute requiredPermission="kardex.index" element={<KardexIndex />} />} />

        {/* TRASPASOS */}
        <Route path="/traspaso/listar" element={<ProtectedRoute requiredPermission="traspaso.index" element={<ListarTraspasos />} />} />
        <Route path="/traspaso/crear" element={<ProtectedRoute requiredPermission="traspaso.store" element={<RegistrarTraspaso />} />} />

        {/* SALIDAS */}
        <Route path="/salida/listar" element={<ProtectedRoute requiredPermission="salida.index" element={<ListarSalidas />} />} />
        <Route path="/salida/crear" element={<ProtectedRoute requiredPermission="salida.store" element={<RegistrarSalida />} />} />

        {/* CATEGORÍAS DE PLATOS */}
        <Route path="/categoria-plato/agregar" element={<ProtectedRoute requiredPermission="categoriaPlato.store" element={<AgregarCategoriaPlato />} />} />
        <Route path="/categoria-plato/editar/:id" element={<ProtectedRoute requiredPermission="categoriaPlato.update" element={<EditarCategoriaPlato />} />} />
        <Route path="/categoria-plato/listar" element={<ProtectedRoute requiredPermission="categoriaPlato.index" element={<ListarCategoriasPlatos />} />} />

        {/* PLATOS */}
        <Route path="/plato/agregar" element={<ProtectedRoute requiredPermission="plato.store" element={<AgregarPlato />} />} />
        <Route path="/plato/editar/:id" element={<ProtectedRoute requiredPermission="plato.update" element={<EditarPlato />} />} />
        <Route path="/plato/listar" element={<ProtectedRoute requiredPermission="plato.index" element={<ListarPlatos />} />} />

        {/* ADICIONALES */}
        <Route path="/adicional/agregar" element={<ProtectedRoute requiredPermission="adicional.store" element={<AgregarAdicional />} />} />
        <Route path="/adicional/editar/:id" element={<ProtectedRoute requiredPermission="adicional.update" element={<EditarAdicional />} />} />
        <Route path="/adicional/listar" element={<ProtectedRoute requiredPermission="adicional.index" element={<ListarAdicionales />} />} />

        {/* MENUS */}
        <Route path="/menu/agregar" element={<ProtectedRoute requiredPermission="menu.store" element={<AgregarMenu />} />} />
        <Route path="/menu/editar/:id" element={<ProtectedRoute requiredPermission="menu.update" element={<EditarMenu />} />} />
        <Route path="/menu/listar" element={<ProtectedRoute requiredPermission="menu.index" element={<ListarMenus />} />} />

        {/* OPCIONES MENU */}
        <Route path="/menu-opcion/agregar" element={<ProtectedRoute requiredPermission="menuOpcion.store" element={<AgregarOpcion />} />} />
        <Route path="/menu-opcion/editar/:id" element={<ProtectedRoute requiredPermission="menuOpcion.update" element={<EditarOpcion />} />} />
        <Route path="/menu-opcion/listar" element={<ProtectedRoute requiredPermission="menuOpcion.index" element={<ListarOpciones />} />} />

        {/* MESAS */}
        <Route path="/mesa/agregar" element={<ProtectedRoute requiredPermission="mesa.store" element={<AgregarMesa />} />} />
        <Route path="/mesa/editar/:id" element={<ProtectedRoute requiredPermission="mesa.update" element={<EditarMesa />} />} />
        <Route path="/mesa/listar" element={<ProtectedRoute requiredPermission="mesa.index" element={<ListarMesas />} />} />
        
       {/* ORDENES SALON */}
        <Route path="/orden/mesas" element={<ProtectedRoute requiredPermission="mesa.mapa" element={<MesasMap />} />} />
        <Route path="/orden/crear/:mesa_id?" element={<ProtectedRoute requiredPermission="ordenSalon.store" element={<StoreSalon />} />} /> 
        <Route path="/orden/salon/:id" element={<ProtectedRoute requiredPermission="ordenSalon.update" element={<UpdateSalon />} />} />
        <Route path="/orden/salon/listar" element={<ProtectedRoute requiredPermission="ordenSalon.index" element={<IndexSalon />} />} />

       {/* ORDENES LLEVAR */}
        <Route path="/orden/llevar/crear?" element={<ProtectedRoute requiredPermission="ordenLlevar.store" element={<StoreLlevar />} />} /> 
        <Route path="/orden/llevar/listar" element={<ProtectedRoute requiredPermission="ordenLlevar.index" element={<IndexLlevar />} />} />

        {/* VENTAS */}
        <Route path="/venta/listar" element={<ProtectedRoute requiredPermission="venta.index" element={<VentaIndex />} />} />
        <Route path="/venta/crear" element={<ProtectedRoute requiredPermission="venta.store" element={<VentaStore />} />} />

        {/* CAJAS */}
        <Route path="/caja/agregar" element={<ProtectedRoute requiredPermission="caja.store" element={<AgregarCaja />} />} />
        <Route path="/caja/editar/:id" element={<ProtectedRoute requiredPermission="caja.update" element={<EditarCaja />} />} />
        <Route path="/caja/listar" element={<ProtectedRoute requiredPermission="caja.index" element={<ListarCajas />} />} />
        <Route path="/caja/sesiones/listar" element={<ProtectedRoute requiredPermission="cajaSesion.index" element={<ListarCajaSesiones />} />} />

        {/* SETTINGS */}
        <Route path="/rol/listar" element={<ProtectedRoute requiredPermission="rol.index" element={<ListarRoles />} />} />

      </Route>

      {/* 3. ERRORES */}
      <Route path="/401" element={<ErrorPage401 />} />
      <Route path="*" element={<ErrorPage404 />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-primary">
          <AppContent />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;