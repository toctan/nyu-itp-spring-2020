import React from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import qs from "qs";

import foursquare from "./APIClient";

export default (props) => {
  let { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const handleCancel = () => {
    const background = location.state && location.state.background;
    if (background) history.goBack();
    else history.push("/");
  };

  React.useEffect(() => {
    if (!window.confirm("Are you sure you want to delete this channel?"))
      return handleCancel();
    foursquare
      .post(
        "demo/marsbot/audio/channels/delete",
        qs.stringify({
          id,
        })
      )
      .then((resp) => history.replace("/channels"));
  });

  return null;
};
