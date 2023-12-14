
import MainNav from "./main-nav";


const Navbar = () => {
  
  return (
    <section className="border-b sticky">
      <div className="flex h-16 items-center px-8">
        
        <MainNav className="mx-6" />
        {/* <div className="ml-auto flex items-center space-x-4">
          
        </div> */}
      </div>
    </section>
  );
};

export default Navbar;
