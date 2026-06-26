export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-logo">F</span>
        <span className="brand-name">FlowPay</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </li>
          <li className="nav-item disabled">
            <span className="nav-icon">🎧</span>
            <span className="nav-text">Atendimentos</span>
          </li>
          <li className="nav-item disabled">
            <span className="nav-icon">👥</span>
            <span className="nav-text">Times</span>
          </li>
          <li className="nav-item disabled">
            <span className="nav-icon">📈</span>
            <span className="nav-text">Relatórios</span>
          </li>
          <li className="nav-item disabled">
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Configurações</span>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="admin-profile">
          <div className="avatar">RM</div>
          <div className="profile-info">
            <span className="profile-name">Rafael Martins</span>
            <span className="profile-role">Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
