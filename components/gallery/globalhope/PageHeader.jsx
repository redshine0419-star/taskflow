export default function PageHeader({ title, breadcrumb }) {
  return (
    <div className="page-header">
      <div className="container">
        <h1>{title}</h1>
        {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
      </div>
    </div>
  )
}
