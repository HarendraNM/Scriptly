import React, { useState, useEffect, useRef, version } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router";
import cppLogo from "../images/cpp.png";
import pythonLogo from "../images/python.png";
import jsLogo from "../images/js.png";
import javaLogo from "../images/java.png";
import cLogo from "../images/c.png";
import csharpLogo from "../images/csharp.png";
import goLogo from "../images/go.png";
import { format } from 'date-fns';

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [options, setOptions] = useState([]);
  const modalRef = useRef(null);
  const editModalRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState(null);

  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [editName, setEditName] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderColor: state.isFocused ? "#3b82f6" : "#374151",
      color: "#ffffff",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderRadius: "8px",
      overflow: "hidden",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#374151"
        : "#1f2937",
      color: "#ffffff",
      padding: "10px 15px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#3b82f6",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#ffffff",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#9ca3af",
      "&:hover": {
        color: "#ffffff",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#374151",
    }),
    input: (base) => ({
      ...base,
      color: "#ffffff",
    }),
  };

  const getRunTimes = async () => {
    try {
      const res = await axios.get("https://emkc.org/api/v2/piston/runtimes");
      const data = res.data;

      const languageMap = {
        python: ["python", "python3"],
        c: ["c"],
        "c++": ["c++", "cpp", "g++"],
        java: ["java"],
        "c#": ["csharp", "cs"],
        go: ["go"],
        javascript: ["javascript", "js"],
      };

      const filteredOptions = Object.entries(languageMap)
        .map(([displayName, aliases]) => {
          const runtime = data.find((item) => aliases.includes(item.language));

          if (runtime) {
            return {
              label: `${
                displayName.charAt(0).toUpperCase() + displayName.slice(1)
              } (v${runtime.version})`,
              value: runtime.language,
            };
          }
          return null;
        })
        .filter(Boolean);

      setOptions(filteredOptions);
    } catch (error) {
      console.error("Error fetching runtimes:", error);
    }
  };

  const [projects, setProjects] = useState(null);

  const getProjects = async () => {
    try {
      const response = await axios.post(`${api_base_url}/getProjects`, {
        token: localStorage.getItem("token"),
      });

      console.log(response.data.projects);
      setProjects(response.data.projects.reverse());
      setUsername(response.data.projects[0].createdBy.fullname);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getRunTimes();
    getProjects();
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsCreateModelShow(false);
      }
    };

    if (isCreateModelShow) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateModelShow]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editModalRef.current &&
        !editModalRef.current.contains(event.target)
      ) {
        setIsEditModalShow(false);
      }
    };

    if (isEditModalShow) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditModalShow]);

  const createProject = async () => {
    if (!name || !selectedOption) {
      toast.error("Project name and language are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to create a project.");
      return;
    }

    try {
      const version = selectedOption.label.match(/\(v(.*?)\)/)?.[1] || "";
      const response = await axios.post(`${api_base_url}/createProject`, {
        name,
        projlanguage: selectedOption.value,
        token,
        version,
      });

      toast.success(response.data.message);

      const newProject = {
        _id: response.data.projectId,
        name,
        projlanguage: selectedOption.value,
        version,
        createdBy: response.data.createdBy,
      };

      setProjects((prevProjects) => [newProject, ...prevProjects]);

      navigate(`/editor/${response.data.projectId}`);
    } catch (error) {
      console.error("Error creating project:", error.response || error.message);
      toast.error(error.response?.data?.error || "Failed to create project.");
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await axios.post(`${api_base_url}/deleteProject`, {
        projectId,
        token: localStorage.getItem("token"),
      });
      toast.success(response.data.message);
      getProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    }
  };

  const updateProjectName = async () => {
    if (!editName.trim()) {
      toast.error("Project name is required.");
      return;
    }

    try {
      const response = await axios.post(`${api_base_url}/updateProject`, {
        projectId: editProjectId,
        name: editName,
        token: localStorage.getItem("token"),
      });

      toast.success(response.data.message);
      setIsEditModalShow(false);
      getProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error(error.response?.data?.error || "Failed to update project.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between mt-5 px-[100px]">
        <h3 className="text-2xl">Hi {username || "User"}</h3>
        <div className="flex items-center">
          <button
            onClick={() => setIsCreateModelShow(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 hover:cursor-pointer"
          >
            Create Project
          </button>
        </div>
      </div>
      <div className="projects px-[100px] mt-8 space-y-4 pb-10">
        {projects && projects.length > 0
          ? projects.map((project) => {
              return (
                <div
                  className="project flex items-center justify-between w-full p-4 bg-gray-900 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer"
                  key={String(project.id || project._id)}
                >
                  <div
                    onClick={() => navigate(`/editor/${project._id}`)}
                    className="flex items-center gap-[15px] w-full"
                  >
                    {project.projlanguage === "c++" ? (
                      <>
                        <img
                          src={cppLogo}
                          className="w-[130px] h-[100px] object-cover"
                          alt=""
                        />
                      </>
                    ) : project.projlanguage === "python" ? (
                      <>
                        <img
                          src={pythonLogo}
                          className="w-[130px] h-[100px] object-cover"
                          alt=""
                        />
                      </>
                    ) : project.projlanguage === "javascript" ? (
                      <>
                        <img
                          src={jsLogo}
                          className="w-[130px] h-[100px] object-cover"
                          alt=""
                        />
                      </>
                    ) : project.projlanguage === "java" ? (
                      <>
                        <img
                          src={javaLogo}
                          className="w-[130px] h-[100px] object-cover"
                          alt=""
                        />
                      </>
                    ) : project.projlanguage === "c" ? (
                      <>
                        <img
                          src={cLogo}
                          className="w-[130px] h-[100px] object-cover"
                          alt=""
                        />
                      </>
                    ) : project.projlanguage === "c#" ||
                      project.projlanguage === "csharp" ? (
                      <>
                        <img
                          src={csharpLogo}
                          className="w-[130px] h-[100px] object-cover"
                          alt=""
                        />
                      </>
                    ) : project.projlanguage === "go" ? (
                      <>
                        <img
                          src={goLogo}
                          className="w-[130px] h-[100px] object-cover"
                          alt=""
                        />
                      </>
                    ) : (
                      ""
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {project.name}{" "}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {format(new Date(project.createdAt), "MMMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[15px]">
                    <button
                      onClick={() => {
                        setEditProjectId(project._id);
                        setEditName(project.name);
                        setIsEditModalShow(true);
                      }}
                      className="bg-blue-500 transition-all hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="bg-red-500 transition-all hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          : "No projects found"}
      </div>

      {isCreateModelShow && (
        <div className="flex flex-col items-center justify-center h-screen w-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] transition-opacity duration-300">
          <div
            ref={modalRef} 
            className="flex flex-col items-start w-[25vw] min-w-[300px] max-w-[500px] h-[40vh] min-h-[300px] bg-gray-900 rounded-lg p-6 shadow-2xl transform transition-transform duration-300 hover:scale-105"
          >
            <h3 className="text-2xl font-bold text-white mb-4 w-full text-center ">
              Create Project
            </h3>
            <div className="inputBox flex flex-col w-full mt-4 mb-6">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Enter project name"
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <Select
              options={options}
              styles={customStyles}
              placeholder="Select a language"
              className="w-full"
              value={selectedOption}
              onChange={(option) => setSelectedOption(option)}
            />
            <button
              onClick={createProject}
              className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 hover:cursor-pointer"
            >
              Create
            </button>
          </div>
        </div>
      )}
      {isEditModalShow && (
        <div className="flex flex-col items-center justify-center h-screen w-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] transition-opacity duration-300">
          <div
            ref={editModalRef}
            className="flex flex-col items-start w-[25vw] min-w-[300px] max-w-[500px] h-[30vh] min-h-[200px] bg-gray-900 rounded-lg p-6 shadow-2xl transform transition-transform duration-300 hover:scale-105"
          >
            <h3 className="text-2xl font-bold text-white mb-4 w-full text-center">
              Edit Project Name
            </h3>
            <input
              onChange={(e) => setEditName(e.target.value)}
              value={editName}
              type="text"
              placeholder="Enter new project name"
              className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={updateProjectName}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 hover:cursor-pointer"
            >
              Update Name
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
