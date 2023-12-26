import { useMatches, Link } from "react-router-dom";

const Breadcrumbs = () => {
    const matches = useMatches();
    console.log('matches: ', matches);
    let crumbs = matches
        .filter((match) => match.handle?.crumbName)
        .map((match) => ({crumbName: match.handle.crumbName, path: match.pathname}));
    
    return (
        <div className="breadcrumbs-container">
            {crumbs.map((crumb, index) => {
                return <Link to={crumb.path}>{crumb.crumbName}</Link>
            })}
        </div>
    );
}

export default Breadcrumbs;