import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import UpdateLlevar from 'pages/orden/llevar/Update';

//UI VENTAS
import VentaIndex from 'pages/venta/Index';
import VentaStore from 'pages/venta/Store';

//UI CAJAS
import AgregarCaja from 'pages/caja/Store';
import EditarCaja from 'pages/caja/Update';
import ListarCajas from 'pages/caja/Index';

// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';
import { AuthProvider } from 'context/AuthContext';

function AppContent() {
  return (
    <Routes>
      {/* 1. LOGIN: Solo accesible si NO estás logueado */}
      <Route path="/" element={<ProtectedRouteHome element={<Login />} />} />

      {/* 2. LAYOUT GLOBAL: Envuelve todas las rutas privadas */}
      <Route
        element={
          <ProtectedRoute 
            element={<SidebarLayout />} 
            allowedRoles={['superadmin', 'admin', 'cajero', 'cocinero','mozo']} 
          />
        }
      >
        <Route path="/home" element={<Home />} />

      {/* =======================================================
            MÓDULO: CLIENTES
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/cliente/agregar" element={<AgregarCliente />} />
            <Route path="/cliente/editar/:id" element={<EditarCliente />} />
            <Route path="/cliente/listar" element={<ListarClientes />} />
        </Route>


        {/* =======================================================
            MÓDULO: EMPLEADOS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/empleado/agregar" element={<AgregarEmpleado />} />
            <Route path="/empleado/editar/:id" element={<EditarEmpleado />} />
            <Route path="/empleado/listar" element={<ListarEmpleados />} />
        </Route>

        {/* =======================================================
            MÓDULO: UNIDADES DE MEDIDA
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/unidad-medida/agregar" element={<AgregarUnidad />} />
            <Route path="/unidad-medida/editar/:id" element={<EditarUnidad />} />
            <Route path="/unidad-medida/listar" element={<ListarUnidades />} />
        </Route>

        {/* =======================================================
            MÓDULO: PROVEEDORES
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/proveedor/agregar" element={<AgregarProveedor />} />
            <Route path="/proveedor/editar/:id" element={<EditarProveedor />} />
            <Route path="/proveedor/listar" element={<ListarProveedores />} />
        </Route>

        {/* =======================================================
            MÓDULO: INSUMOS (MAESTRO)
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/insumo/agregar" element={<AgregarInsumo />} />
            <Route path="/insumo/editar/:id" element={<EditarInsumo />} />
            <Route path="/insumo/listar" element={<ListarInsumos />} />
        </Route>

        {/* =======================================================
            MÓDULO: ALMACENES (MAESTRO)
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/almacen/agregar" element={<AgregarAlmacen />} />
            <Route path="/almacen/editar/:id" element={<EditarAlmacen />} />
            <Route path="/almacen/listar" element={<ListarAlmacenes />} />
            <Route path="/almacen/stock" element={<StockAlmacen />} />
        </Route>

        {/* =======================================================
            MÓDULO: COMPRAS Y ABASTECIMIENTO
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/compra/listar" element={<ListarCompras />} />
            <Route path="/compra/agregar" element={<RegistrarCompra />} />
        </Route>

        {/* =======================================================
            MÓDULO: INVENTARIO Y KARDEX
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/kardex/listar" element={<KardexIndex />} />
        </Route>

        {/* =======================================================
            MÓDULO: TRASPASOS ENTRE ALMACENES
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin','mozo']} />}>
            <Route path="/traspaso/listar" element={<ListarTraspasos />} />
            <Route path="/traspaso/crear" element={<RegistrarTraspaso />} />
        </Route>

        {/* =======================================================
            MÓDULO: SALIDAS (CONSUMO, MERMA, AJUSTES)
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/salida/listar" element={<ListarSalidas />} />
            <Route path="/salida/crear" element={<RegistrarSalida />} />
        </Route>

        {/* =======================================================
            MÓDULO: CATEGORÍAS DE PLATOS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/categoria-plato/agregar" element={<AgregarCategoriaPlato />} />
            <Route path="/categoria-plato/editar/:id" element={<EditarCategoriaPlato />} />
            <Route path="/categoria-plato/listar" element={<ListarCategoriasPlatos />} />
        </Route>

        {/* =======================================================
            MÓDULO: PLATOS (CARTA Y MENÚ)
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/plato/agregar" element={<AgregarPlato />} />
            <Route path="/plato/editar/:id" element={<EditarPlato />} />
            <Route path="/plato/listar" element={<ListarPlatos />} />
        </Route>

        {/* =======================================================
            MÓDULO: ADICIONALES
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/adicional/agregar" element={<AgregarAdicional />} />
            <Route path="/adicional/editar/:id" element={<EditarAdicional />} />
            <Route path="/adicional/listar" element={<ListarAdicionales />} />
        </Route>

        {/* =======================================================
            MÓDULO: MENUS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/menu/agregar" element={<AgregarMenu />} />
            <Route path="/menu/editar/:id" element={<EditarMenu />} />
            <Route path="/menu/listar" element={<ListarMenus />} />
        </Route>

        {/* =======================================================
            MÓDULO: OPCIONES MENU
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/menu-opcion/agregar" element={<AgregarOpcion />} />
            <Route path="/menu-opcion/editar/:id" element={<EditarOpcion />} />
            <Route path="/menu-opcion/listar" element={<ListarOpciones />} />
        </Route>

        {/* =======================================================
            MÓDULO: MESAS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin']} />}>
            <Route path="/mesa/agregar" element={<AgregarMesa />} />
            <Route path="/mesa/editar/:id" element={<EditarMesa />} />
            <Route path="/mesa/listar" element={<ListarMesas />} />
        </Route>
        
        {/* =======================================================
            MÓDULO: ORDENES PARA SALON
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin','mozo']} />}>
            <Route path="/orden/mesas" element={<MesasMap />} />
            <Route path="/orden/crear/:mesa_id?" element={<StoreSalon  />} /> 
            <Route path="/orden/salon/:id" element={<UpdateSalon  />} />
            <Route path="/orden/salon/listar" element={<IndexSalon  />} />
        </Route>

        {/* =======================================================
            MÓDULO: ORDENES PARA LLEVAR
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin','cajero']} />}>
            <Route path="/orden/llevar/crear?" element={<StoreLlevar  />} /> 
            <Route path="/orden/llevar/editar/:id" element={<UpdateLlevar  />} />
            <Route path="/orden/llevar/listar" element={<IndexLlevar  />} />
        </Route>

        {/* =======================================================
              MÓDULO: VENTAS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'cajero']} />}>
            <Route path="/venta/listar" element={<VentaIndex />} />
            <Route path="/venta/crear" element={<VentaStore />} />
        </Route>

        {/* =======================================================
              MÓDULO: CAJAS Y VENTAS
        ======================================================= */}
        <Route element={<ProtectedRoute element={<Outlet />} allowedRoles={['superadmin', 'cajero']} />}>
            <Route path="/caja/agregar" element={<AgregarCaja />} />
            <Route path="/caja/editar/:id" element={<EditarCaja />} />
            <Route path="/caja/listar" element={<ListarCajas />} />
        </Route>

        

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